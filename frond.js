var head = document.head;
var html = document.createElement("html");
html.setAttribute("lang", "en");




var charsetMeta = document.createElement("meta");
charsetMeta.setAttribute("charset", "UTF-8");
head.appendChild(charsetMeta);


var viewportMeta = document.createElement("meta");
viewportMeta.setAttribute("name", "viewport");
viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0");
head.appendChild(viewportMeta);


var titleElement = document.createElement("title");
titleElement.textContent = "User Detailes";
head.appendChild(titleElement);


document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;

    const container = document.createElement('div');
    container.className = 'container';
    container.style = 'max-width: 100vw; margin: auto; padding: 2% 10%;';

    const heading = document.createElement('h1');
    heading.textContent = 'User Detailes';
    heading.style.textAlign = 'center';

    const entryInput = document.createElement('input');
    entryInput.type = 'text';
    entryInput.id = 'entryInput';
    entryInput.placeholder = 'Enter Any User ';
    entryInput.style = 'width: 100%; padding: 10px 0px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;';

    const entryList = document.createElement('ul');
    entryList.id = 'entryList';
    entryList.style = 'list-style: none; padding: 0;';

    body.appendChild(container);
    container.appendChild(heading);
    container.appendChild(entryInput);
    container.appendChild(entryList);



    window.onload = function () {
        fetch('dd')
            .then(response => response.json())
            .then(data => {
                const entries = data[0].entries;
                entries.forEach(entry => {
                    addEntry(entry.text, entry.details);
                });

                entryInput.addEventListener('keypress', async (event) => {
                    if (event.key === 'Enter') {
                        const entryText = entryInput.value.trim();
                        if (entryText !== '') {
                            const formData = {
                                text: entryText
                            };
                            try {
                                const response = await fetch('/dd', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(formData)
                                })
                                if (response.ok) {
                                    console.log('data sended successfull');
                                    addEntry(entryText);
                                    entryInput.value = '';
                                }
                                else {
                                    console.error('failed');
                                }
                            }
                            catch (error) {
                                console.error('an error ', error)
                            }
                        }
                    }
                });

                function addEntry(text, details) {
                    const entry = document.createElement('li');
                    entry.className = 'entry';

                    const entryContainer = document.createElement('div');
                    entryContainer.style.cssText = 'background-color: #fff; border: 1px solid #ccc; border-radius: 4px; padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;';

                    const entryText = document.createElement('span');
                    entryText.textContent = text;

                    const entryButtons = document.createElement('div');
                    entryButtons.style.cssText = 'display: flex;';

                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Details';
                    updateButton.style.cssText = 'background-color: #007bff; color: #fff; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; margin-right: 5px;';

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.style.cssText = 'background-color: #ff4444; color: #fff; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;';

                    entryButtons.appendChild(updateButton);
                    entryButtons.appendChild(deleteButton);
                    entryContainer.appendChild(entryText);
                    entryContainer.appendChild(entryButtons);
                    entry.appendChild(entryContainer);
                    entryList.appendChild(entry);

                    deleteButton.addEventListener('click', async () => {
                        if (confirm('Are you sure you want to delete this entry?')) {
                            try {
                                const response = await fetch('dd', {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ text }) // Make sure 'text' contains the correct value
                                });
                    
                                if (response.ok) {
                                    console.log('Data deleted successfully');
                                    entryList.removeChild(entry); // Remove the entry from the frontend
                                } else {
                                    console.error('Failed to delete data on server.');
                                }
                            } catch (error) {
                                console.error('An error occurred:', error);
                            }
                        }
                    });
                    

                    updateButton.addEventListener('click', () => {
                        const modal = document.createElement('div');
                        modal.style.cssText = "display: flex; justify-content: center; align-items: center; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);";

                        const modalContent = document.createElement('div');
                        modalContent.style.cssText = "display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #ffffff; padding: 20px; border: 2px solid #ff9900; width: 60vw; max-width: 400px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);position:relative;";

                        const closeButton = document.createElement('button');
                        closeButton.textContent = "Close";
                        closeButton.style.cssText = "position: absolute; bottom: 0px; right: 0; background-color: #ff4444; color: white; border: none; border-radius: 10px 0 8px 0; padding: 5px 10px; cursor: pointer;";

                        closeButton.addEventListener("click", () => {
                            document.body.removeChild(modal);
                        });

                        function createFormRow(labelText, inputElement) {
                            const formRow = document.createElement('div');
                            formRow.style.marginBottom = '20px';
                            const label = document.createElement('label');
                            label.textContent = labelText;
                            label.style.marginRight = '10px';
                            formRow.appendChild(label);
                            formRow.appendChild(inputElement);
                            return formRow;
                        }


                        const form = document.createElement('form');
                        form.style.cssText = "text-align: center; padding: 20px; margin: 10px;";

                        const dp = document.createElement('img');
                        dp.style.cssText = 'border-radius: 100%; display: none; width: 100px; height: 100px; border: 1px solid gray; margin: 10px auto;';
                        dp.id = 'profilePicture';

                        const placeInput = document.createElement('input');
                        placeInput.placeholder = 'Your Place';
                        placeInput.id = 'placeInput';
                        const placeRow = createFormRow('Your Place:', placeInput);
                        placeRow.id = 'placeRow';

                        const emailInput = document.createElement('input');
                        emailInput.placeholder = 'Your Email';
                        emailInput.id = 'emailInput';
                        const emailRow = createFormRow('Your Email:', emailInput);
                        emailRow.id = 'emailRow';

                        const phoneInput = document.createElement('input');
                        phoneInput.placeholder = 'Your Phone';
                        phoneInput.id = 'phoneInput';
                        const phoneRow = createFormRow('Your Phone:', phoneInput);
                        phoneRow.id = 'phoneRow';

                        const jobInput = document.createElement('input');
                        jobInput.placeholder = 'Your Job';
                        jobInput.id = 'jobInput';
                        const jobRow = createFormRow('Your Job:', jobInput);
                        jobRow.id = 'jobRow';

                        const profileInput = document.createElement('input');
                        profileInput.placeholder = 'Profile Link';
                        profileInput.id = 'profileInput';
                        const profileRow = createFormRow('Profile Link:', profileInput);
                        profileRow.id = 'profileRow';

                        const submit = document.createElement('button');
                        submit.textContent = 'CREATE';
                        submit.style.backgroundColor = '#007bff';
                        submit.style.color = '#fff';
                        submit.style.border = 'none';
                        submit.style.borderRadius = '4px';
                        submit.style.padding = '10px 20px';
                        submit.style.cursor = 'pointer';
                        submit.style.width = '50%';
                        submit.id = 'submit';

                        const matchingEntry = entries.find(entry => entry.text === text);

                        if (matchingEntry) {
                            // Populate the modal with existing data
                            placeInput.value = matchingEntry.place || '';
                            phoneInput.value = matchingEntry.phone || '';
                            jobInput.value = matchingEntry.job || '';
                            emailInput.value = matchingEntry.email || '';
                            profileInput.value = matchingEntry.profileLink || '';
                            dp.src = profileInput.value;
                            dp.alt = "👨🏼‍🎓";
                            dp.style.display = "block";

                            // Change button label and disable inputs
                            if (placeInput.value !== '') {
                                submit.textContent = "UPDATE";
                                placeInput.disabled = true;
                                phoneInput.disabled = true;
                                jobInput.disabled = true;
                                emailInput.disabled = true;
                                profileInput.disabled = true;
                            } else {
                                submit.textContent = "CREATE";
                                placeInput.disabled = false;
                                phoneInput.disabled = false;
                                jobInput.disabled = false;
                                emailInput.disabled = false;
                                profileInput.disabled = false;
                            }
                        } else {
                            // Clear existing data and enable inputs
                            placeInput.value = '';
                            phoneInput.value = '';
                            jobInput.value = '';
                            emailInput.value = '';
                            profileInput.value = '';
                            dp.src = '';
                            dp.alt = '';
                            dp.style.display = "none";

                            // Change button label and enable inputs
                            submit.textContent = "CREATE";
                            placeInput.disabled = false;
                            phoneInput.disabled = false;
                            jobInput.disabled = false;
                            emailInput.disabled = false;
                            profileInput.disabled = false;
                        }

                        form.appendChild(placeRow);
                        form.appendChild(emailRow);
                        form.appendChild(phoneRow);
                        form.appendChild(jobRow);
                        form.appendChild(profileRow);
                        form.appendChild(submit);

                        modalContent.appendChild(closeButton);
                        modalContent.appendChild(dp);
                        modalContent.appendChild(form);
                        modal.appendChild(modalContent);

                        document.body.appendChild(modal);

                        submit.addEventListener('click', async (event) => {
                            event.preventDefault();
                            if (!validateFormInputs()) {
                                return;
                            }
                            const updatedtext = entryText.textContent;

                            const placeInput = document.getElementById('placeInput');
                            const phoneInput = document.getElementById('phoneInput');
                            const jobInput = document.getElementById('jobInput');
                            const emailInput = document.getElementById('emailInput');
                            const profileInput = document.getElementById('profileInput');
                            const dp = document.getElementById('profilePicture');


                            const formData = {
                                text: updatedtext,
                                place: placeInput.value,
                                phone: phoneInput.value,
                                job: jobInput.value,
                                email: emailInput.value,
                                profileLink: profileInput.value
                            };

                            try {
                                const entriesData = await fetch('/dd');
                                const entries = await entriesData.json();

                                console.log(entries);

                                const entryToUpdate = entries[0].entries.find(entry => entry.text === updatedtext);
                                if (entryToUpdate) {
                                    Object.assign(entryToUpdate, formData);

                                    const putResponse = await fetch('dd', {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(entryToUpdate),
                                    });

                                    if (putResponse.ok) {
                                        console.log('Data updated successfully on server.');
                                    } else {
                                        console.error('Failed to update data on server.');
                                    }
                                } else {
                                    console.error('Entry not found:', updatedtext);
                                }
                            } catch (error) {
                                console.error('An error occurred:', error);
                            }


                            placeInput.disabled = true;
                            phoneInput.disabled = true;
                            jobInput.disabled = true;
                            emailInput.disabled = true;
                            profileInput.style.display = "none";
                            profileRow.style.display = "none";
                            dp.src = profileInput.value;
                            dp.alt = "https://www.unigreet.com/wp-content/uploads/2022/11/Unique-dp-images-for-whatsapp-profile-1024x1017.jpg";
                            dp.style.display = "block";



                            if (submit.textContent === "CREATE") {
                                window.location.reload();
                                dp.style.display = 'none';
                            } else if (submit.textContent === "UPDATE") {
                                submit.textContent = "SEND"
                                placeInput.disabled = false;
                                phoneInput.disabled = false;
                                jobInput.disabled = false;
                                emailInput.disabled = false;
                                profileInput.disabled = false;
                            } else if (submit.textContent === "SEND") {
                                const matchingEntry = entries.find(entry => entry.text === text);

                                if (matchingEntry) {
                                    // Populate the modal with existing data
                                    placeInput.value = matchingEntry.place || '';
                                    phoneInput.value = matchingEntry.phone || '';
                                    jobInput.value = matchingEntry.job || '';
                                    emailInput.value = matchingEntry.email || '';
                                    profileInput.value = matchingEntry.profileLink || '';
                                    dp.src = profileInput.value;
                                    dp.alt = "👨🏼‍🎓";
                                    dp.style.display = "block";

                                    // Change button label and disable inputs
                                    submit.textContent = "UPDATE";
                                    placeInput.disabled = true;
                                    phoneInput.disabled = true;
                                    jobInput.disabled = true;
                                    emailInput.disabled = true;
                                    profileInput.disabled = true;
                                }
                            }

                        });
                    });
                }
            })
            .catch(error => { console.log('Error fetching data:', error) });
    };


    function validateFormInputs() {
        const placeInput = document.getElementById('placeInput');
        const phoneInput = document.getElementById('phoneInput');
        const jobInput = document.getElementById('jobInput');
        const emailInput = document.getElementById('emailInput');
        const profileInput = document.getElementById('profileInput');

        const validationErrors = [];

        if (placeInput.value.trim().length < 3) {
            validationErrors.push('place must be at least 3 characters long.');
        }

        if (!/^\d{10}$/.test(phoneInput.value.trim())) {
            validationErrors.push('Please enter a valid 10-digit phone number.');
        }

        if (jobInput.value.trim().length < 3) {
            validationErrors.push('Job must be at least 3 characters long.');
        }

        if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(emailInput.value.trim())) {
            validationErrors.push('Please enter a valid email address.');
        }

        if (!/^https?:\/\/\S+$/.test(profileInput.value.trim())) {
            validationErrors.push('Please enter a valid URL for the profile link.');
        }

        if (validationErrors.length > 0) {
            alert(validationErrors.join('\n'));
            return false;
        }

        return true; // All inputs are valid
    }



});
