import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      scope: 'email',
      profileFields: ['emails', 'name', 'photos'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    // const { id, displayName, photos, emails } = profile;
    // const user = {
    //   facebookId: id,
    //   displayName,
    //   photoUrl: photos[0]?.value,
    //   email: emails[0]?.value,
    // };
    // const payload = {
    //   user,
    //   accessToken,
    // };
    done(null, profile);
  }
}
