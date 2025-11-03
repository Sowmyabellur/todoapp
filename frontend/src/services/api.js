const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

async function request(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response
            .json()
            .catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
        );
    }
    return response.json();
}

export const getTodos = () => {
    return request('/todos');
};

export const addTodo = title => {
    return request('/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });
};

export const updateTodo = (id, data) => {
    return request(`/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

export const deleteTodo = id => {
    return request(`/todos/${id}`, {
        method: 'DELETE',
    });
};