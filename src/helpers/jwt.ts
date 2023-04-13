import crypto from 'crypto';
import { type JwtPayload, sign, verify, decode } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export class Jwt {
  constructor(private readonly configService: ConfigService) {}
  async generateToken(payload: object, expiresIn = '2h'): Promise<string> {
    // Convert payload to a JSON string
    const JWT_SECRET = this.configService.get('JWT_SECRET');
    const payloadString = JSON.stringify(payload);

    // Create a signature for the payload using the secret key
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(payloadString).digest('base64');

    // Encode the payload and signature as a JWT token
    return sign({ payload, signature }, JWT_SECRET, { expiresIn });
  }

  async verifyToken(token: string): Promise<string | JwtPayload> {
    // Decode the token into its payload and signature components
    const JWT_SECRET = this.configService.get('JWT_SECRET');
    const decodedToken = decode(token) as JwtPayload | null;

    if (decodedToken === null) throw 'Access denied';
    // Verify the signature using the secret key
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(JSON.stringify(decodedToken.payload))
      .digest('base64');
    if (decodedToken.signature !== signature) throw 'Invalid token signature';

    // Verify that the token has not expired
    verify(token, JWT_SECRET, (err: unknown, _: unknown) => {
      if (err !== null) throw 'Token Expired';
    });

    // If all checks pass, return the payload
    return decodedToken.payload;
  }
}
