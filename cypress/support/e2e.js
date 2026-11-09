// Global Cypress support entry point.
import 'cypress-mochawesome-reporter/register';
import 'cypress-plugin-steps';
import registerCypressGrep from '@cypress/grep/src/support';
import './commands';

registerCypressGrep();

// Modern web polyfill: Translate draft HTTP 'QUERY' method calls from Angular's HttpClient
// to standard 'GET' with query string parameters so Node's HTTP parser in Cypress does not reject them.
beforeEach(() => {
  cy.on('window:before:load', (win) => {
    const origOpen = win.XMLHttpRequest.prototype.open;
    const origSend = win.XMLHttpRequest.prototype.send;
    const origSetHeader = win.XMLHttpRequest.prototype.setRequestHeader;

    win.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this._method = method;
      this._url = url;
      this._rest = rest;
      if (method === 'QUERY') {
        this._headers = [];
        return;
      }
      return origOpen.call(this, method, url, ...rest);
    };

    win.XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      if (this._method === 'QUERY') {
        this._headers.push([header, value]);
        return;
      }
      return origSetHeader.call(this, header, value);
    };

    win.XMLHttpRequest.prototype.send = function (body) {
      if (this._method === 'QUERY') {
        let finalUrl = this._url;
        if (body) {
          try {
            const parsed = typeof body === 'string' ? JSON.parse(body) : body;
            const searchParams = new URLSearchParams();
            Object.entries(parsed).forEach(([k, v]) => {
              if (v !== undefined && v !== null && v !== '') {
                searchParams.append(k, String(v));
              }
            });
            const qs = searchParams.toString();
            if (qs) {
              finalUrl += (finalUrl.includes('?') ? '&' : '?') + qs;
            }
          } catch (err) {
            // Ignore parse errors on non-JSON payload bodies
            void err;
          }
        }
        origOpen.call(this, 'GET', finalUrl, ...(this._rest || []));
        if (this._headers) {
          this._headers.forEach(([h, v]) => {
            try {
              origSetHeader.call(this, h, v);
            } catch (err) {
              // Ignore header errors on modified request
              void err;
            }
          });
        }
        return origSend.call(this, null);
      }
      return origSend.call(this, body);
    };
  });
});
