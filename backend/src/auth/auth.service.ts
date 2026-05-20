import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async register(dto: RegisterDto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email already registered');

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashed,
                firstName: dto.firstName,
                lastName: dto.lastName,
            },
        });

        const tokens = await this.generateTokens(user);
        // remove existing refresh tokens for this user to avoid unique constraint collisions
        await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });
        await this.prisma.refreshToken.create({
            data: { token: tokens.refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        });

        // return safe user
        const { password, ...userSafe } = user as any;
        return { user: userSafe, tokens };
    }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;
        const { password: _p, ...rest } = user as any;
        return rest;
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        const tokens = await this.generateTokens(user);
        // rotate: remove any existing refresh tokens for this user to prevent duplicates
        await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });
        await this.prisma.refreshToken.create({
            data: { token: tokens.refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        });

        const { password, ...userSafe } = user as any;
        return { user: userSafe, tokens };
    }

    async logout(refreshToken: string) {
        await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        return { success: true };
    }

    async refreshToken(oldRefreshToken: string) {
        const record = await this.prisma.refreshToken.findUnique({ where: { token: oldRefreshToken } });
        if (!record) throw new UnauthorizedException('Invalid refresh token');

        try {
            const payload = await this.jwtService.verifyAsync(oldRefreshToken, { secret: process.env.JWT_REFRESH_SECRET || 'change_me_refresh' });
            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user) throw new UnauthorizedException('Invalid token user');

            // rotate token
            await this.prisma.refreshToken.deleteMany({ where: { token: oldRefreshToken } });
            const tokens = await this.generateTokens(user);
            await this.prisma.refreshToken.create({
                data: { token: tokens.refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
            });

            const { password, ...userSafe } = user as any;
            return { user: userSafe, tokens };
        } catch (err) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private async generateTokens(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET || 'change_me', expiresIn: '15m' });
        const refreshToken = await this.jwtService.signAsync({ sub: user.id }, { secret: process.env.JWT_REFRESH_SECRET || 'change_me_refresh', expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
}
