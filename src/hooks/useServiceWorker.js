import { useRegisterSW } from 'virtual:pwa-register/react';

export function useServiceWorker() {
    const updateServiceWorker = useRegisterSW({
        onRegistered(r) {
            r &&
                setInterval(() => {
                    r.update();
                }, 60_000);
        },
    });
}
