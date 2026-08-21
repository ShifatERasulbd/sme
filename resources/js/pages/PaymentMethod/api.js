async function ensureCsrfCookie() {
    await fetch('/sanctum/csrf-cookie', {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
        const error = new Error(payload?.message || 'Request failed');
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

export async function fetchPaymentMethods() {
    const payload = await requestJson('/api/payment-methods');
    return Array.isArray(payload) ? payload : [];
}

export async function deletePaymentMethod(id) {
    await ensureCsrfCookie();
    return requestJson(`/api/payment-methods/${id}`, {
        method: 'DELETE',
    });
}