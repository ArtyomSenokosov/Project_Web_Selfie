// Converts the data to a JSON string and stores it under the specified key
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
};

// Retrieves the data by key and parses it back to its original form
export const loadFromLocalStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error loading from localStorage:", error);
        return null;
    }
};

// Deletes the item stored under the specified key
export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from localStorage:", error);
    }
};
