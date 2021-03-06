import { RequestStrategy } from '@orbit/coordinator';

// When we query the in-memory store of Orbit, also pull that data from the remote store (API)
// Non-blocking so the in-memory store can return results without this interfering
export default {
  create() {
    return new RequestStrategy({
      name: 'remote-query',

      source: 'store',
      on: 'beforeQuery',

      target: 'remote',
      action: 'pull',

      blocking(query) {
        return !!(query.options && query.options.blocking);
      },

      catch(error, query) {
        if (query.options && query.options.blocking) {
          this.source.requestQueue.skip();
          this.target.requestQueue.skip();
        }
        throw error;
      }
    });
  }
};
