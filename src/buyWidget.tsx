import { CBPayInstanceType, initOnRamp } from "@coinbase/cbpay-js";
import { useEffect, useState } from "react";

type PayWithCoinbaseButtonProps = {
  sendAddress: string;
  amount: number;
};

export const PayWithCoinbaseButton: React.FC<PayWithCoinbaseButtonProps> = ({ sendAddress, amount }) => {
  const [onrampInstance, setOnrampInstance] = useState<CBPayInstanceType | null>();
  console.log('sendAddress:', sendAddress)


  useEffect(() => {
    initOnRamp({
      appId: process.env.NEXT_PUBLIC_CB_CLIENT_ID as string,
      widgetParameters: {
        addresses: { [sendAddress]: ['base'] },
        presetCryptoAmount: amount,
        defaultExperience: 'buy',
        // destinationWallets: [{
        //   address: sendAddress,
        //   blockchains: ['base'],
        // }],
        // Filter the available assets on the above networks to just these ones
        assets: ['ETH', 'USDC'],
      },
      onSuccess: () => {
        console.log('success');

      },
      onExit: () => {
        console.log('exit');
      },
      onEvent: (event) => {
        console.log('event', event);
      },
      experienceLoggedIn: 'popup',
      experienceLoggedOut: 'popup',
      closeOnExit: true,
      closeOnSuccess: true,
    }, (_, instance) => {
      setOnrampInstance(instance);
    });

    // When button unmounts destroy the instance
    return () => {
      onrampInstance?.destroy();
    };
  }, [onrampInstance]);

  const handleClick = () => {
    onrampInstance?.open();
  };

  return <button onClick={handleClick} disabled={!onrampInstance}>Buy with Coinbase</button>;
};

export default PayWithCoinbaseButton