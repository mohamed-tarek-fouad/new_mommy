import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Patch,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientProxy } from '@nestjs/microservices/client';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { AuthDto } from './dtos/auth.dto';
import { RtGuard } from '../common/guards';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { ForgetPasswordDto } from './dtos/forgetPassword.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { DeleteAccountDto } from './dtos/deleteAccount.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}
  @Public()
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @Post('logout')
  logout(@Req() req) {
    return this.authService.logout(req);
  }
  @Public()
  @Post('forgetPassword')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }
  @Public()
  @Post('verifyResetMessage/:token')
  verifyResetMessage(
    @Param('token') token: string,
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ) {
    return this.authService.verifyResetMessage(token, forgetPasswordDto);
  }
  @Public()
  @Post('resetPassword/:token')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string,
  ) {
    return this.authService.resetPassword(resetPasswordDto, token);
  }
  @Patch()
  updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(req, updateUserDto);
  }
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
  @Post('verifyPhoneNumber')
  verifyPhoneNumber(@Req() req) {
    return this.authService.verifyPhoneNumber(req);
  }
  @Post('resetEmailDigits')
  verifyResetEmailToken(@Req() req, @Param('token') token: string) {
    return this.authService.verifyResetEmailToken(req, token);
  }
  @Post('newEmail/:token')
  newEmail(
    @Body() resetEmailDto: ForgetPasswordDto,
    @Param('token') token: string,
    @Req() req,
  ) {
    return this.authService.newEmail(resetEmailDto, token, req);
  }
  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
  @Public()
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req) {
    return this.authService.facebookLogin(req);
  }
  @Delete('deleteAccount')
  deleteAccount(@Body() deleteAccountDto: DeleteAccountDto, @Req() req) {
    return this.authService.deleteAccount(deleteAccountDto, req);
  }
}
