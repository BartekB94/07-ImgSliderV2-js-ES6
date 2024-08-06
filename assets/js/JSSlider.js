export default class JSSlider {
    constructor() {
        this.autoSlide = null
    }
    run(){
        this.imagesSelector = '.gallery__item';
        this.sliderRootSelector = '.js-slider'; 
    
        this.imagesList = document.querySelectorAll(this.imagesSelector);
        this.sliderRootElement = document.querySelector(this.sliderRootSelector);

        this.initEvents();
        this.initCustomEvents( );
    }
    initEvents() {
        this.imagesList.forEach((item) => {
            item.addEventListener('click', (e) => {
                this.fireCustomEvent(e.currentTarget, 'js-slider-img-click');
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-start');
            });
            
        });

        const navNext = this.sliderRootElement.querySelector('.js-slider__nav--next');
        if (navNext) {
            navNext.addEventListener('click', (e) => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-next');
            });
            navNext.addEventListener('mouseenter', (e) => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-stop');
            });
            navNext.addEventListener('mouseleave', (e) => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-start');
            });
        }

        const navPrev = this.sliderRootElement.querySelector('.js-slider__nav--prev');
        if (navPrev) {
            navPrev.addEventListener('click', (e) => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-prev');
            });
            navPrev.addEventListener('mouseenter', (e) => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-stop');
            });
            navPrev.addEventListener('mouseleave', (e) => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-start');
            });
        }

        const zoom = this.sliderRootElement.querySelector('.js-slider__zoom');
        if(zoom) {
            zoom.addEventListener('click', (e) => {
                if(e.target === e.currentTarget) {
                    this.fireCustomEvent(this.sliderRootElement, 'js-slider-close');
                    this.fireCustomEvent(this.sliderRootElement, 'js-slider-stop')
                }
            })
        }
    }
    initCustomEvents() {
        this.imagesList.forEach((img) => {
            img.addEventListener('js-slider-img-click', (event) => {
                this.onImageClick(event);
            });
        });
    
        this.sliderRootElement.addEventListener('js-slider-img-next', (e) => this.onImageNext);
        this.sliderRootElement.addEventListener('js-slider-img-prev', (e) => this.onImagePrev);
        this.sliderRootElement.addEventListener('js-slider-close', (e) => this.onClose);
        this.sliderRootElement.addEventListener('js-slider-start', () => this.sliderStart());
        this.sliderRootElement.addEventListener('js-slider-stop', () => this.sliderStop());
    }
    onImageNext(event) {
        console.log(this, 'onImageNext');
        // [this] wskazuje na element [.js-slider]
        const jsSliderElement = event.currentTarget;
        // todo:
        // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
        // 2. znaleźć element następny do wyświetlenie względem drzewa DOM
        // 3. sprawdzić czy ten element istnieje
        // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
        // 5. podmienić atrybut src dla [.js-slider__image]
        const currentClassName = 'js-slider__thumbs-image--current';
        const current = jsSliderElement.querySelector('.'+currentClassName);
        const thumbParent = document.querySelector('.js-slider__thumbs')

        const parentCurrent = current.parentElement;
        const nextElement = parentCurrent.nextElementSibling;
        if(nextElement && !nextElement.className.includes('js-slider__thumbs-item--prototype')) {
            const img = nextElement.querySelector('img')
            img.classList.add(currentClassName);
    
            jsSliderElement.querySelector('.js-slider__image').src = img.src;
            current.classList.remove(currentClassName);  

            // this.handleImage(nextElement, currentClassName, this) //wyskakuje blad ze to nie jest funkcja, w dodatku 'this' wskazuje na element (linia 74, 75)
        } else if (!nextElement) {
            const firstElement = thumbParent.querySelector('.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)')
            const img = firstElement.querySelector('img')
            img.classList.add(currentClassName)
            jsSliderElement.querySelector('.js-slider__image').src = img.src;
            current.classList.remove(currentClassName);
        }
    }
    onImagePrev(event) {
        console.log(this, 'onImagePrev');
        // [this] wskazuje na element [.js-slider]
        
        // todo:
        // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
        // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM
        // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
        // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
        // 5. podmienić atrybut src dla [.js-slider__image]
        const currentClassName = 'js-slider__thumbs-image--current';
        const current = this.querySelector('.'+currentClassName);
        const thumbParent = document.querySelector('.js-slider__thumbs')

        const parentCurrent = current.parentElement;
        const prevElement = parentCurrent.previousElementSibling;
        if(prevElement && !prevElement.className.includes('js-slider__thumbs-item--prototype')) {
            const img = prevElement.querySelector('img')
            img.classList.add(currentClassName);
    
            this.querySelector('.js-slider__image').src = img.src;
            current.classList.remove(currentClassName);
        } else if (prevElement.classList.contains('js-slider__thumbs-item--prototype')) {
            const lastElement = thumbParent.lastElementChild

            const img = lastElement.querySelector('img')
            img.classList.add(currentClassName);
            this.querySelector('.js-slider__image').src = img.src;
            current.classList.remove(currentClassName);
        }
    }
    fireCustomEvent(element, name) {
        console.log(element.className, '=>', name);
    
        const event = new CustomEvent(name, {
            bubbles: true,
        });
    
        element.dispatchEvent( event );
    }
    onImageClick(event) {
        this.sliderRootElement.classList.add('js-slider--active');
        
        const src = event.currentTarget.querySelector('img').src;
        this.sliderRootElement.querySelector('.js-slider__image').src = src;
    
        const groupName = event.currentTarget.dataset.sliderGroupName;
        const thumbsList = document.querySelectorAll(this.imagesSelector +'[data-slider-group-name='+ groupName +']');
        thumbsList.forEach( (thumb) => {
            this.createThumb(thumb, src)
        })

    }

    createThumb(thumb, src) {
        const prototype = document.querySelector('.js-slider__thumbs-item--prototype');
        const thumbElement = prototype.cloneNode(true);
        thumbElement.classList.remove('js-slider__thumbs-item--prototype');
        const thumbImg = thumbElement.querySelector('img');
        thumbImg.src = thumb.querySelector('img').src;
        if(thumbImg.src === src) {
            thumbImg.classList.add('js-slider__thumbs-image--current');
        }

        document.querySelector('.js-slider__thumbs').appendChild(thumbElement);
    }
    onClose({ currentTarget }) {
        // todo:
        // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
        // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
        currentTarget.classList.remove('js-slider--active');
        const thumbsList = this.querySelectorAll('.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)');
        thumbsList.forEach( item => item.parentElement.removeChild(item));
    }

    sliderStart() {
        this.sliderStop()
        this.autoSlide = setInterval(() =>{
            this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-next');
        }, 3000)
    }

    sliderStop() {
        if (this.autoSlide) {
            clearInterval(this.autoSlide);
            this.autoSlide = null;
        }
    }
    handleImage(element, currentClassName, root) { //chcialem tego uzyc ale dzieje sie jakies kontekstowe rodeo, ktorego nie rozumiem
        const img = element.querySelector('img')
        img.classList.add(currentClassName);

        root.querySelector('.js-slider__image').src = img.src;
        root.classList.remove(currentClassName);
    }
}