import { expect } from '@esm-bundle/chai';
import { Store } from '../src/store/Store'
import { api } from '../src/webapi/api';
import sinon from 'sinon';

it('should set store user if login was successful', done => {
    const loginApiStub = sinon.stub(api, "login").callsFake(() => Promise.resolve({ user: { name: 'balazs' } }))
    const store = new Store(api)
    expect(store.user).eq(null)
    store.login('asd', 'asd')
        .then(() => expect(store.user.name).eq('balazs'))
        .finally(()=>{
            loginApiStub.restore()
            done()
        })
});

it('should set store user to null if logout was successful', done => {
    const logoutApiStub = sinon.stub(api, "logout").callsFake(() => Promise.resolve("successful logout"))
    const store = new Store(api)
    store['state'].user = {'name':'balazs'} // access private field trick for tests!
    store.logout()
        .then(() => expect(store.user).to.equal(null))
        .finally(()=>{
            logoutApiStub.restore()
            done()
        })
});

it("fetching user should set user in store", done => {
    const meApiStub = sinon.stub(api, "me").callsFake(() => Promise.resolve({ name: 'balazs' }));
    const store = new Store(api);
    store.me()
        .then(() => {
            expect(store.user.name).to.equal("balazs");
        })
        .finally(() => {
            meApiStub.restore();
            done();
        })
})


it("fetching user should not set user in store, if fetch fails with an error", done => {
    const meApiStub = sinon.stub(api, "me").callsFake(() => Promise.resolve({ error: 'Fetch failed' }));
    const store = new Store(api);
    store.me()
        .then(() => {
            expect(store.user).to.equal(null);
        })
        .finally(() => {
            meApiStub.restore();
            done();
        })
})
