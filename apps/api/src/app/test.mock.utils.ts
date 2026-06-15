import { faker } from '@faker-js/faker';

export class TestMockUtils {
  static jwt() {
    const refDate = faker.defaultRefDate();
    const iatDefault = faker.date.recent({ refDate });

    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };
    const payload = {
      iat: Math.round(iatDefault.getTime() / 1000),
      exp: Math.round(faker.date.soon({ refDate }).getTime() / 1000),
      nbf: Math.round(faker.date.anytime({ refDate }).getTime() / 1000),
      iss: faker.company.name(),
      sub: faker.string.uuid(),
      aud: faker.string.uuid(),
      jti: faker.string.uuid(),
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      'base64',
    );
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      'base64',
    );
    const encodedSignature = faker.string.alphanumeric(64);
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }
}
