(() => {
  if (!import.meta.env.DEV) return; // skip in prod

  let panel = null; // active overlay element
  let lastError = null; // remember error for "Fix"

  const html = (parts, ...vals) => parts.reduce((s, c, i) => s + c + (vals[i] ?? ''), '');

  // single message handler shared across mounts to avoid leaking multiple listeners
  const healthyResponseType = 'sandbox:web:healthcheck:response';
  const healthyResponse = {
    type: healthyResponseType,
    healthy: true,
    hasError: true,
  };

  const handleMessage = (event) => {
    try {
      const data = event?.data;
      if (!data) return;
      if (data.type === 'sandbox:navigation') {
        if (typeof data.pathname === 'string') {
          window.location.pathname = data.pathname;
        }
      } else if (data.type === 'sandbox:web:healthcheck') {
        window.parent.postMessage(healthyResponse, '*');
      }
    } catch (e) {
      console.error('dev-error-overlay message handler error', e);
    }
  };

  let messageHandlerAdded = false;
  function addMessageHandler() {
    if (messageHandlerAdded) return;
    window.addEventListener('message', handleMessage);
    messageHandlerAdded = true;
  }
  function removeMessageHandler() {
    if (!messageHandlerAdded) return;
    window.removeEventListener('message', handleMessage);
    messageHandlerAdded = false;
  }

  function mount(msg, stack) {
    try {
      lastError = new Error(String(msg ?? 'Unknown error'));
      if (stack) lastError.stack = stack;

      if (!panel) {
        panel = document.createElement('div');
        panel.id = '__create_error_panel';
        document.body.appendChild(panel);
      }

      // ensure we only add the message handler once
      addMessageHandler();

      window.parent.postMessage({ type: 'sandbox:web:ready' }, '*');

      const [fix, logs, copy] = [
        document.getElementById('fix'),
        document.getElementById('logs'),
        document.getElementById('copy'),
      ];
      const isInIframe = window.self !== window.top;
      if (isInIframe) {
        // show all the buttons
        for (const button of [fix, copy, logs]) {
          button?.classList.remove('opacity-0');
          button?.classList.add('opacity-100');
        }
      } else {
        // show only copy when not in iframe
        copy?.classList.remove('opacity-0');
        copy?.classList.add('opacity-100');
        for (const button of [fix, logs]) {
          button?.classList.add('hidden');
        }
      }

      console.error(lastError);

      panel.outerHTML = html`
        <div id="__create_error_panel"
             class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[2147483647]
                    transition-all duration-500 ease-out translate-y-0 opacity-100">
          <div
            class="bg-[#18191B] text-[#F2F2F2] rounded-lg p-4 max-w-md
                   w-[calc(100vw-2rem)] mx-4 shadow-lg flex flex-col gap-2">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-[#F2F2F2] rounded-full flex
                         items-center justify-center">
                  <span class="text-black text-[1.125rem] leading-none">⚠</span>
                </div>
              </div>

              <div class="flex flex-col gap-2 flex-1">
                <p class="font-light text-sm">App Error Detected</p>
                <p class="text-[#959697] text-sm font-light">
                  It looks like an error occurred while trying to use your app.
                </p>

                <div class="flex gap-2">
                  <button id="fix"
                    class="flex flex-row items-center justify-center gap-[4px]
                           outline-none transition-all rounded-[8px] border-[1px]
                           bg-[#f9f9f9] hover:bg-[#dbdbdb] active:bg-[#c4c4c4]
                           border-[#c4c4c4] text-[#18191B] text-sm px-[8px] py-[4px] opacity-0">
                    Try to fix
                  </button>

                  <button id="logs"
                    class="flex flex-row items-center justify-center gap-[4px]
                           outline-none transition-all rounded-[8px] border-[1px]
                           bg-[#2C2D2F] hover:bg-[#414243] active:bg-[#555658]
                           border-[#414243] text-white text-sm px-[8px] py-[4px] opacity-0">
                    Show logs
                  </button>

                  <button id="copy"
                    class="flex flex-row items-center justify-center gap-[4px]
                           outline-none transition-all rounded-[8px] border-[1px]
                           bg-[#2C2D2F] hover:bg-[#414243] active:bg-[#555658]
                           border-[#414243] text-white text-sm px-[8px] py-[4px] opacity-0">
                    Copy error
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      panel = document.getElementById('__create_error_panel');

      /* button wiring --------------------------------------------------- */
      const copyBtn = panel.querySelector('#copy');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const text = `${lastError.message}\n${lastError.stack || ''}`;
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).catch(() => {});
          } else {
            // fallback for older browsers or restricted environments
            const t = document.createElement('textarea');
            t.value = text;
            t.setAttribute('aria-hidden', 'true');
            document.body.appendChild(t);
            t.select();
            try { document.execCommand('copy'); } catch (e) { /* ignore */ }
            t.remove();
          }
        });
      }

      const logsBtn = panel.querySelector('#logs');
      if (logsBtn) logsBtn.addEventListener('click', sendLogsMessage);

      const fixBtn = panel.querySelector('#fix');
      if (fixBtn) fixBtn.addEventListener('click', sendFixMessage);

    } catch (e) {
      // ensure overlay code never throws and disrupts dev experience
      console.error('Failed to mount dev error overlay', e);
    }
  }

  function clear() {
    panel?.classList.add('translate-y-[200%]', 'opacity-0');
    setTimeout(() => panel?.remove(), 400);
    panel = null;

    // remove the shared message handler when overlay is cleared
    removeMessageHandler();
  }

  function sendLogsMessage() {
    window.parent?.postMessage({ type: 'sandbox:web:show-logs' }, '*');
  }

  function sendFixMessage() {
    window.parent?.postMessage(
      {
        type: 'sandbox:web:fix',
        error: { message: lastError?.message, stack: lastError?.stack, name: lastError?.name },
      },
      '*'
    );
    clear();
  }

  /* vite HMR channel ------------------------------------------------- */
  if (import.meta.hot) {
    const onViteError = (payload) => {
      try {
        const err = payload?.err ?? payload;
        if (!err) {
          console.warn('vite:error with empty payload', payload);
          return;
        }
        const message = err?.message ?? (typeof err === 'string' ? err : 'Unknown error');
        const stack = err?.stack ?? '';
        mount(message, stack);
      } catch (e) {
        console.error('Error handling vite:error', e);
      }
    };

    import.meta.hot.on('vite:error', onViteError);
    ['vite:beforeUpdate', 'vite:afterUpdate', 'vite:beforeFullReload'].forEach((evt) =>
      import.meta.hot.on(evt, clear)
    );

    if (import.meta.hot.dispose) {
      import.meta.hot.dispose(() => {
        try {
          import.meta.hot.off?.('vite:error', onViteError);
          ['vite:beforeUpdate', 'vite:afterUpdate', 'vite:beforeFullReload'].forEach((evt) =>
            import.meta.hot.off?.(evt, clear)
          );
        } finally {
          removeMessageHandler();
        }
      });
    }
  }
})();
