import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { TakenActionEnum } from '../admin/admin.constant';
import { SendMailOptions } from './interfaces/mail.interface';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('APP_PASS'),
      },
    });
  }

  private compileTemplate(templateName: string, context: any): string {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.hbs`
    );

    const source = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);

    return template(context);
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    const html = this.compileTemplate(options.template, options.context);

    try {
      await this.transporter.sendMail({
        from: 'Pet Care <' + this.configService.get<string>('EMAIL_USER') + '>',
        to: options.to,
        subject: options.subject,
        html,
      });

      this.logger.log(`Email sent to ${options.to}`);
    } catch (error) {
      this.logger.error(`Email sending failed`, error);
      throw error;
    }
  }

  async sendOtpEmail(to: string, code: string, name = 'User') {
    return this.sendMail({
      to,
      subject: 'Your One-Time Verification Code',
      template: 'otp',
      context: {
        title: 'OTP Verification',
        name,
        code,
        expiresIn: 5,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendAdminActionEmail(
    to: string,
    userName: string,
    actionType: TakenActionEnum,
    options?: { reason?: string; suspendUntil?: Date } // note removed from email context
  ) {
    let suspendUntilFormatted: string | undefined;
    if (options?.suspendUntil) {
      suspendUntilFormatted = options.suspendUntil.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    // Dynamic subject
    let subject = `Important: Action Taken on Your Account`;
    switch (actionType) {
      case TakenActionEnum.BAN:
        subject = `Your Account Has Been Banned`;
        break;
      case TakenActionEnum.SUSPEND:
        subject = `Your Account Has Been Suspended`;
        break;
      case TakenActionEnum.DELETE:
        subject = `Content Deleted on Your Account`;
        break;
      case TakenActionEnum.HIDE:
        subject = `Content Hidden on Your Account`;
        break;
      case TakenActionEnum.IGNORE:
        subject = `Report Dismissed`;
        break;
      case TakenActionEnum.REACTIVATE:
        subject = `Your Account Has Been Reactivated`;
        break;
    }

    function getActionMessage(actionType: string) {
      switch (actionType) {
        case 'BAN':
          return 'Your account has been permanently banned';
        case 'SUSPEND':
          return 'Your account has been temporarily suspended';
        case 'DELETE':
          return 'Your content has been removed';
        case 'HIDE':
          return 'Your content has been hidden';
        case 'IGNORE':
          return 'No action was taken';
        case 'REACTIVATE':
          return 'Your account has been reactivated and is now active';
        default:
          return 'An action has been applied';
      }
    }

    const actionMessage = getActionMessage(actionType);

    return this.sendMail({
      to,
      subject,
      template: 'adminAction',
      context: {
        userName,
        actionMessage,
        reason: options?.reason,
        suspendUntil: suspendUntilFormatted,
        year: new Date().getFullYear(),
        supportEmail: 'support@example.com', // replace with env or config
        appName: 'PetApp', // replace with env or config
      },
    });
  }
}
