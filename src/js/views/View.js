import icons from 'url:../../img/icons.svg'; // parcel2 requires any non script asset to have a url: at the beginning of the string

export default class View{
    _data;
    
    render(data, render = true){
        //If data doesn't exist or if the length of the data array is 0 stop process and display error
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
        this._data = data;
        const html = this._generateMarkup();

        if(!render) return html;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', html);
    }

    update(data){  
        this._data = data;
        const newHtml = this._generateMarkup();

        const newDom = document.createRange().createContextualFragment(newHtml);
        const newElements = Array.from(newDom.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            //Updates text
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
                curEl.textContent = newEl.textContent;
            }

            //Updates attributes 
            if(!newEl.isEqualNode(curEl)){
                Array.from(newEl.attributes).forEach(attr => 
                    curEl.setAttribute(attr.name, attr.value));
            }
        })
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }

    renderSpinner(){
        const html = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', html);
    }

    renderError(message = this._errorMessage){
        const html = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', html);
    }

    renderMessage(message = this._message){
        const html = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', html);
    }
}