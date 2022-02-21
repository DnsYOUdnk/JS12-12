class User {
    constructor({id, name, phone, email, address}) {
        this.data = {id, name, phone, email, address};
        this.editMode = false;
    }

    changeFlag(newEditMode) {
        this.editMode = newEditMode;
    }

    set editUser(data) {
        this.data = {...this.data, ...data};
    }

    get informUser() {
        return this.data;
    }
}

class Contacts {
    constructor() {
        this.contactsData = this.getContactsData();
    }

    getContactsData() {
        let data = (localStorage.getItem('contactsBookData') && document.cookie) ? JSON.parse(localStorage.getItem('contactsBookData')) : [];
        if(data.length > 0) {
            data = data.map(({data}) => new User(data))
            return data
        }
        return data
    }

    add({name, phone, email, address}) {
        const user = new User({
                id: Date.now(),
                name,
                phone,
                email,
                address,
            });
        this.contactsData.push(user)
    }

    edit(idContact, editContactData) {
        const userFound = this.contactsData.find(({data:{id}}) => id == idContact);
        if(!userFound) return;

        userFound.editUser = editContactData;
    }

    remove(idContact) {
        this.contactsData = this.contactsData.filter(({data:{id}}) => id != idContact);
    }

    clearAll() {
        if(!this.contactsData.length) {
            return
        } else if(confirm('Clear all?')){
            this.contactsData = [];
        }
    }

    get() {
        return this;
    }
}

class ContactsApp extends Contacts{
    constructor (data) {
        super(data);
        this.inputUserName;
        this.inputUserPhone;
        this.inputUserEmail;
        this.inputUserAddress;
        this.addNewContactBtn;
        this.clearAllContactsBtn;
        this.listContacts;
        this.createHTML();
        this.addEvent();
        this.onShowContacts();
    }

    createHTML() {
        const appContacts = document.createElement('div')
              appContacts.classList.add('app__contacts');
        const entryFieldContact = document.createElement('div')
              entryFieldContact.classList.add('contacts__input_field', 'container');
        this.listContacts = document.createElement('div')
            this.listContacts.classList.add('contacts__list', 'container');
        
        this.inputUserName = document.createElement('input')
            this.inputUserName.classList.add('contact__name');
            this.inputUserName.setAttribute('placeholder', 'Name');
        this.inputUserPhone = document.createElement('input')
            this.inputUserPhone.classList.add('contact__phone');
            this.inputUserPhone.setAttribute('placeholder', 'Phone');
        this.inputUserEmail = document.createElement('input')
            this.inputUserEmail.classList.add('contact__email');
            this.inputUserEmail.setAttribute('placeholder', 'Email');
        this.inputUserAddress = document.createElement('input')
            this.inputUserAddress.classList.add('contact__address');
            this.inputUserAddress.setAttribute('placeholder', 'Address');
        
        this.addNewContactBtn = document.createElement('button')
            this.addNewContactBtn.classList.add('contact__add__button');
            this.addNewContactBtn.innerText = 'Add new contact';
        this.clearAllContactsBtn = document.createElement('button')
            this.clearAllContactsBtn.classList.add('contacts__clear__button');
            this.clearAllContactsBtn.innerText = 'Сlear all contacts';
        
        const appContactsTitle = document.createElement('h1');
              appContactsTitle.innerText = 'Contact book';

        entryFieldContact.append(appContactsTitle, this.inputUserName, this.inputUserPhone, this.inputUserEmail, this.inputUserAddress, this.addNewContactBtn, this.clearAllContactsBtn);

        appContacts.append(entryFieldContact, this.listContacts);
        document.body.appendChild(appContacts);
    }

    addEvent() {
        this.addNewContactBtn.addEventListener('click', () => {
            let contactsData = this.get().contactsData;
            contactsData.forEach(item => {
                item.editMode = false;
            })
            if(this.inputUserName.value && (this.inputUserPhone.value || this.inputUserEmail.value)) {
            this.onAdd({
                name: this.inputUserName.value,
                phone: this.inputUserPhone.value,
                email: this.inputUserEmail.value,
                address: this.inputUserAddress.value,
            })

            this.inputUserName.value = '';
            this.inputUserPhone.value = '';
            this.inputUserEmail.value = '';
            this.inputUserAddress.value = '';
        
            } else {
                alert('Not enough data');
            }
        })

        this.clearAllContactsBtn.addEventListener('click', () => {
            this.onClearAll()
        })
    }

    onAdd(data) {
        this.add(data);
        this.onShowContacts();
    }

    onClearAll() {
        this.clearAll();
        this.onShowContacts();
    }

    onShowContacts() {
        const contactsData = this.get().contactsData;
        localStorage.setItem('contactsBookData', JSON.stringify(contactsData));
        let date = new Date(Date.now() + 20000)
            date = date.toUTCString();
        if(contactsData.length > 0) {
            document.cookie = 'storageExpiration=true; expires=' + date;
        } else {
            document.cookie = 'storageExpiration=true; max-age=-1'
        };

        let ul = document.querySelector('.contacts__items')
        if(!ul){
            ul = document.createElement('ul');
            ul.classList.add('contacts__items')
        }

        let list = '';

        if (!contactsData) return;
            contactsData.forEach(({data:{id, name, phone , email, address,}, editMode}) => {
            
                list += `<li class="contact__item">
                            <div class="contact__item__view">
                                <p><span>Name:</span>    <input type="text" class="contact__item__input input__name" data-name="${id}" ${editMode ? '' : 'disabled'} value="${name || "No contact information"}"></p>  
                                <p><span>Phone:</span>   <input type="text" class="contact__item__input input__phone" data-phone="${id}" ${editMode ? '' : 'disabled'}  value="${phone || "No contact information"}"></p>
                                <p><span>E-mail:</span>  <input type="text" class="contact__item__input input__email" data-email="${id}" ${editMode ? '' : 'disabled'}  value="${email || "No contact information"}"></p>    
                                <p><span>Address:</span> <input type="text" class="contact__item__input input__address" data-address="${id}" ${editMode ? '' : 'disabled'}  value="${address || "No contact information"}"></p>
                            </div>
                            <div class="contact__item__btns">
                                ${editMode ? "<button class='contact__item__save' data-save="+id+" data-mode='false'>Save</button>" : "<button class='contact__item__delete' data-delete="+id+">Delete</button>"}
                                ${editMode ? "<button class='contact__item__cancel' data-cancel="+id+" data-mode='false'>Cancel</button>" : "<button class='contact__item__edit' data-edit="+id+" data-mode='true'>Edit</button>"}
                            </div>    
                        </li>`
        })

        ul.innerHTML = list;
        this.listContacts.appendChild(ul);
        this.onAddEventRemoveEdit();
    }

    onAddEventRemoveEdit() {
        const deleteContactBtns = document.querySelectorAll('.contact__item__delete');
              deleteContactBtns.forEach(deleteBtn => {
                  deleteBtn.addEventListener('click', (event) => {
                    this.onDeleteContact(event.target.dataset.delete)
                  })
              })

        const editContactBtns = document.querySelectorAll('.contact__item__edit');
              editContactBtns.forEach(editBtn => {
                  editBtn.addEventListener('click', (event) => {
                      this.onEditModeContact(event.target.dataset.edit, event.target.dataset.mode)
                  })
              })

        const cancelContactBtn = document.querySelector('.contact__item__cancel');
              if(!cancelContactBtn) return;
              cancelContactBtn.addEventListener('click', (event) => {
                      this.onEditModeContact(event.target.dataset.cancel, event.target.dataset.mode)
              })

        const saveContactBtn = document.querySelector('.contact__item__save');
              if(!saveContactBtn) return;
              saveContactBtn.addEventListener('click', (event) => {
                      this.onSaveContactChanges(event.target.dataset.save, event.target.dataset.mode);
              })
    }

    onDeleteContact(idContactDel) {
        this.remove(idContactDel)
        this.onShowContacts()
    }

    onEditModeContact(idContactEdit, newEditMode) {
        let editMode = newEditMode == 'true';
        const data = this.get().contactsData;
        const editUsers = data.map((item) => {
            if(item.data.id == idContactEdit) {
                item.editMode = editMode;
            } else {
                item.editMode = false;
            }
            return item;
        })
        this.get().contactsData = editUsers;
        this.onShowContacts()
    }

    onSaveContactChanges(idContactEdit, newEditMode) {
        const inputName = document.querySelector(`input[data-name="${idContactEdit}"]`);
        const inputPhone = document.querySelector(`input[data-phone="${idContactEdit}"]`);
        const inputEmail = document.querySelector(`input[data-email="${idContactEdit}"]`);
        const inputAddress = document.querySelector(`input[data-address="${idContactEdit}"]`);
        let editUser = {
            name: inputName.value,
            phone: inputPhone.value,
            email: inputEmail.value,
            address: inputAddress.value
        };
        this.edit(idContactEdit, editUser);
        this.onEditModeContact(idContactEdit, newEditMode);
    }

    get() {
        return super.get()
    }
}

window.addEventListener('load', () => {
    const contactBook = new ContactsApp()
})