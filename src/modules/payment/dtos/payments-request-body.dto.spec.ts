import { PaymentsRequestBodyDto } from './payments-request-body.dto';

describe('PaymentsRequestBodyDto', () => {
  it('should be defined', () => {
    expect(new PaymentsRequestBodyDto()).toBeDefined();
  });
});
