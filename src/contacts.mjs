import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { v4 as uuidv4 } from 'uuid';

const contactsPath = resolve('src/db/contacts.json');

/**
 * @returns {Promise<Array>} - масив контактів
 */
export async function listContacts() {
    const fileContent = await readFile(contactsPath, { encoding: 'utf-8' });
    return JSON.parse(fileContent);
}

export async function getContactById(contactId) {
    const contacts = await listContacts();
    return contacts.find(({ id }) => id === contactId) ?? null;
}

export async function removeContact(contactId) {
    const contacts = await listContacts();
    const idx = contacts.findIndex(({ id }) => id === contactId);
    if (idx === -1) {
        return null;
    }
    const [removedContact] = contacts.splice(idx, 1);
    await writeFile(contactsPath, JSON.stringify(contacts, null, 4));
    return removedContact;
}

export async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = { id: uuidv4(), name, email, phone };
    contacts.push(newContact);
    await writeFile(contactsPath, JSON.stringify(contacts, null, 4));
    return newContact;
}
