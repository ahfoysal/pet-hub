import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail = this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL'
      );

      const privateKey = this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n'); // fix newlines

      if (!projectId || !clientEmail || !privateKey) {
        this.logger.error('Missing Firebase configuration in .env');
        return;
      }

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      this.logger.log(`Firebase Admin initialized for project: ${projectId}`);
    } catch (error) {
      this.logger.error('Firebase Admin initialization failed', error);
      throw error;
    }
  }

  /** Get the initialized app */
  get app(): admin.app.App {
    if (!this.firebaseApp) throw new Error('Firebase has not been initialized');
    return this.firebaseApp;
  }

  /** Verify Firebase ID token */
  async verifyIdToken(idToken: string) {
    const decoded = await this.app.auth().verifyIdToken(idToken);
    console.log({ decoded });
    return decoded;
  }

  /** Get user info by UID */
  async getUser(uid: string) {
    return this.app.auth().getUser(uid);
  }

  /** Get user info by Email */
  async getUserByEmail(email: string) {
    return this.app.auth().getUserByEmail(email);
  }

  /** Create a new Firebase user */
  async createUser(data: admin.auth.CreateRequest) {
    return this.app.auth().createUser(data);
  }

  /** Update existing Firebase user */
  async updateUser(uid: string, data: admin.auth.UpdateRequest) {
    return this.app.auth().updateUser(uid, data);
  }

  /** Delete Firebase user */
  async deleteUser(uid: string) {
    return this.app.auth().deleteUser(uid);
  }
}
