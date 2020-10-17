export type StateManagerType = {
  set: (key: string, value: any) => any;
  get: (key: string) => any;
};

const StateManager = (): StateManagerType => {
  const states: { [key: string]: any } = {};

  return {
    set(key: string, value: any) {
      states[key] = value;
      return states[key];
    },

    get(key: string) {
      return states[key];
    },
  };
};

export default StateManager;
