//function for set notification config
export const notificationConfig = (person) => {

    const message = {

        person : person,
        message : `${person.fullName} sent you request`

    }

    return message

}