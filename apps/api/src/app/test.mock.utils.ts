import * as jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';

export class TestMockUtils {
  static invalidJwt() {
    return jwt.sign(
      {
        sub: faker.string.uuid(),
        email: faker.internet.email(),
      },
      faker.string.alpha(16),
    );
  }
}
