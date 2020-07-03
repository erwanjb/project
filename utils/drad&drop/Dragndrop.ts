export default class SetDragnDropByClass {
    items: HTMLElement[];
    classItem: string;
    classContainers: string;
    oneContent: boolean;
    constructor (classItem, classContainers, oneContent) {
        this.items = [];
        this.classItem = classItem;
        this.classContainers = classContainers;
        this.oneContent = oneContent ?  true : false;
    }
    dragstart() {
        const tokens = document.getElementsByClassName(this.classItem);
        for (const [index, token] of Array.from(tokens).entries()) {
            
            this.items.push(token as HTMLElement);
            token.addEventListener('dragstart', function(e: Event & { dataTransfer?: DataTransfer } ) {
                e.dataTransfer.setData('toto', '' + index);
                // alert('Vous avez bien déposé votre élément !');
            });
        }
    }

    drop () {
        const containers = document.getElementsByClassName(this.classContainers);
        for (const container of containers) {
            container.addEventListener('dragover', function(e) {
                e.preventDefault(); // Annule l'interdiction de drop
            });
            container.addEventListener('drop', this.dropFunction.bind(this), false);
        }
    }

    dropFunction (e) {
        if (this.oneContent) {
            const childs = e.target.childNodes;
            if (childs.length) {
                return;
            }
        }

        if (e.target.className.match(this.classContainers)) {
            const index = parseInt(e.dataTransfer.getData('toto'));
            const child = this.items[index];
            /* const newChild = child.parentNode.removeChild(child);
            e.target.appendChild(newChild); */
            // this.items[index] = newChild;
            if (this.oneContent) {
                e.target.style.display = "flex";
                e.target.style.justifyContent = "center";
                e.target.style.alignItems = "center"
            } else {
                e.target.style.position = 'relative';
                /* newChild.style.position = 'absolute';
                newChild.style.left = e.offsetX + "px";
                newChild.style.top = e.offsetY + "px"; */
                child.style.position = 'absolute';
                child.style.left = e.offsetX + "px";
                child.style.top = e.offsetY + "px";
            }
        }
    }
}