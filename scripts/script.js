class User {
    constructor({id, name, phone, email, address}) {
        this.data = {id, name, phone, email, address};
        this.editMode = false;
    }

    changeFlag(newEditMode) {
        this.editMode = newEditMode;
    }

    set editUser(data) {
        Object.assign(this.data, data)
    }

    get informUser() {
        return this.data;
    }
}

class Contacts {
    constructor() {
        this.contactsData = [];
    }

    add({id, name, phone, email, address}) {
        const user = new User({
                id: !id ? Date.now() : id,
                name,
                phone,
                email,
                address,
            });

        this.contactsData.push(user)
    }

    changeFlagMode(idContact,newEditMode) {
        const userFound = this.contactsData.find(({data:{id}}) => id == idContact);
        if(!userFound) return;

        userFound.changeFlag(newEditMode);
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
    }

    createHTML() {
        const appContacts = document.createElement('div')
              appContacts.classList.add('app__contacts');
        const inputFieldContact = document.createElement('div')
              inputFieldContact.classList.add('contacts__input_field', 'container');
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

        inputFieldContact.append(appContactsTitle, this.inputUserName, this.inputUserPhone, this.inputUserEmail, this.inputUserAddress, this.addNewContactBtn, this.clearAllContactsBtn);

        appContacts.append(inputFieldContact, this.listContacts);
        document.body.appendChild(appContacts);
    }

    addEvent() {
        this.addNewContactBtn.addEventListener('click', () => {
            let contactsData = this.get().contactsData
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
                                <p><span>Name:</span>    <input class="contact__item__input input__name" data-name="${id}" ${editMode ? '' : 'disabled'} value=${name}></p>  
                                <p><span>Phone:</span>   <input class="contact__item__input input__phone" data-phone="${id}" ${editMode ? '' : 'disabled'}  value=${phone}></p>
                                <p><span>E-mail:</span>  <input class="contact__item__input input__email" data-email="${id}" ${editMode ? '' : 'disabled'}  value=${email}></p>    
                                <p><span>Address:</span> <input class="contact__item__input input__address" data-address="${id}" ${editMode ? '' : 'disabled'}  value=${address}></p>
                            </div>
                            <div class="contact__item__btns">
                                ${editMode ? "<button class='contact__item__save' data-save="+id+" data-mode='false'>Save</button>" : "<button class='contact__item__delete' data-delete="+id+">Delete</button>"}
                                ${editMode ? "<button class='contact__item__cancel' data-cancel="+id+" data-mode='false'>Cancel</button>" : "<button class='contact__item__edit' data-edit="+id+" data-mode='true'>Edit</button>"}
                            </div>    
                        </li>`
        })

        ul.innerHTML = list;
        this.listContacts.appendChild(ul);
        
        let jsonContactsData = JSON.stringify(contactsData)
        localStorage.setItem('contactsBookData', jsonContactsData);

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

        const cancelContactBtns = document.querySelectorAll('.contact__item__cancel');
              cancelContactBtns.forEach(cancelBtn => {
                cancelBtn.addEventListener('click', (event) => {
                      this.onEditModeContact(event.target.dataset.cancel, event.target.dataset.mode)
                  })
              })

        const saveContactBtns = document.querySelectorAll('.contact__item__save');
              saveContactBtns.forEach(saveBtn => {
                saveBtn.addEventListener('click', (event) => {
                      this.onSaveContactChanges(event.target.dataset.save);
                      this.onEditModeContact(event.target.dataset.save, event.target.dataset.mode)
                  })
              })
    }

    onDeleteContact(idContactDel) {
        this.remove(idContactDel)
        this.onShowContacts()
    }

    onEditModeContact(idContactEdit, newEditMode) {
        let editMode = newEditMode == 'true';
        this.changeFlagMode(idContactEdit,editMode)
        this.onShowContacts()
    }

    onSaveContactChanges(idContactEdit) {
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
        this.edit(idContactEdit, editUser)
        this.onShowContacts()
    }

    get() {
        return super.get()
    }
}

window.addEventListener('load', () => {
    const contactBook = new ContactsApp()
    const saveData = JSON.parse(localStorage.getItem('contactsBookData'));
    if(!saveData) {
        return
    } else {
        saveData.forEach(item => {
        contactBook.add(item.data)
    })
    contactBook.onShowContacts()
    }
})