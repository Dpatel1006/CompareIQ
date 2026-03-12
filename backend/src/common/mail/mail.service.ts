import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.pass'),
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get<string>('cors.origin')}/reset-password?token=${token}`;

    await this.sendMail({
      to: email,
      subject: 'Reset your CompareIQ password',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.sendMail({
      to: email,
      subject: 'Welcome to CompareIQ!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>We're excited to have you on board. Start comparing products with AI today!</p>
        <a href="${this.configService.get<string>('cors.origin')}/compare">Start Comparing</a>
      `,
    });
  }

  async sendUpgradeEmail(email: string, tier: string) {
    await this.sendMail({
      to: email,
      subject: `Your plan has been upgraded to ${tier}!`,
      html: `
        <h1>Account Upgraded</h1>
        <p>Success! Your account has been upgraded to the <strong>${tier}</strong> plan.</p>
        <p>You now have access to higher daily limits and premium features.</p>
      `,
    });
  }

  async sendWeeklyDigestEmail(
    email: string,
    name: string,
    stats: { totalComparisons: number; topCategories: string[] },
  ) {
    const topCategoriesStr =
      stats.topCategories.length > 0
        ? `Top categories you explored: <strong>${stats.topCategories.join(', ')}</strong>`
        : '';

    await this.sendMail({
      to: email,
      subject: 'Your CompareIQ Weekly Digest',
      html: `
        <h1>Hi ${name || 'there'},</h1>
        <p>Here is your weekly activity summary on CompareIQ:</p>
        <p>You made <strong>${stats.totalComparisons}</strong> comparisons this week!</p>
        ${topCategoriesStr ? `<p>${topCategoriesStr}</p>` : ''}
        <br/>
        <p>Ready to discover your next purchase?</p>
        <a href="${this.configService.get<string>('cors.origin')}/compare">Start Comparing Now</a>
      `,
    });
  }

  private async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('mail.from'),
        ...options,
      });
      this.logger.log(`Email sent: ${info.messageId}`);
      // If using Ethereal, log the preview URL
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`📩 Preview URL: ${previewUrl}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
    }
  }
}
