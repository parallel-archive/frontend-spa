
import { clone } from '../src/utils/utils';
import { expect } from '@esm-bundle/chai';

it('should clone object', () => {
  const result = clone({a: "cica", b: 3});
  expect(JSON.stringify(result)).to.equal('{"a":"cica","b":3}');
});

it('cloned object should be "object" type', () => {
  const result = clone({a: "cica", b: 3});
  expect(typeof(result)).to.equal("object");
});
