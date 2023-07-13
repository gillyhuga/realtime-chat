import { useEffect } from 'react';
import Ably from 'ably/promises';

const ably = new Ably.Realtime.Promise({ authUrl: '/api' });

export function useChannel(channelName: string, callbackOnMessage: (msg: any) => void): [any, any] {
  const channel = ably.channels.get(channelName);

  const onMount = () => {
    channel.subscribe((msg: any) => {
      callbackOnMessage(msg);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };

  const useEffectHook = () => {
    onMount();
    return () => {
      onUnmount();
    };
  };

  useEffect(useEffectHook);

  return [channel, ably];
}
