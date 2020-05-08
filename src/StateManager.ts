const StateManager = () => {
  const states: { [key: string]: any } = {};

  return {
    setState(key: string, value: any) {
      states[key] = value;
    },

    getState(key: string) {
      return states[key];
    },
  };
};

export default StateManager;
