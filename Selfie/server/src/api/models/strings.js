const strings = {
    auth: {
        userExists: "User email already exists",
        contactAdmin: "Please, contact the administrator",
        userNotFound: "User email does not exist",
        invalidPassword: "Invalid password",
        userCreated: "User created successfully",
        tokenRenewed: "Token renewed successfully",
        noTokenProvided: "No token provided",
        invalidToken: "Invalid token"
    },
    events: {
        eventCreated: "Event created successfully",
        eventNotFound: "Event not found",
        eventUpdated: "Event updated successfully",
        eventDeleted: "Event deleted successfully",
        databaseError: "Could not connect to the database. Please contact the administrator."
    },
    notes: {
        noteCreated: "Note created successfully",
        noteNotFound: "Note not found",
        noteUpdated: "Note updated successfully",
        noteDeleted: "Note deleted successfully",
        fetchError: "Failed to fetch notes",
        createError: "Failed to create note",
        updateError: "Failed to update note",
        deleteError: "Failed to delete note",
        authRequired: "User authentication required"
    }
};

export default strings;
