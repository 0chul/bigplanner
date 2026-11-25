// Replaces the service client only inside the isolated Vite browser test server.
const identity = document.cookie.match(/(?:^|; )pm-test-user=([^;]+)/)?.[1];
const user = identity && identity !== 'guest' ? { id: identity, email: identity + '@example.test' } : null;
export const supabaseUrl = location.origin;
export const supabase = {
  auth: {
    async getSession() { return { data: { session: user ? { user } : null } }; },
    onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
  },
  from(table) {
    return {
      select() {
        if (table !== 'profiles') return Promise.resolve({ data: [], error: null });
        return {
          eq(_column, id) {
            const role = ['owner-a', 'owner-b'].includes(id) ? 'admin' : 'member';
            return { async single() { return { data: { role }, error: null }; } };
          },
        };
      },
    };
  },
  channel() { return { on() { return this; }, subscribe() { return this; } }; },
  removeChannel() {},
  storage: {
    from(bucket) {
      return {
        async download(name) {
          const response = await fetch('/__pm-browser-test/storage/' + bucket + '/' + encodeURIComponent(name));
          return response.ok
            ? { data: await response.blob(), error: null }
            : { data: null, error: new Error('Test object unavailable') };
        },
      };
    },
  },
};
