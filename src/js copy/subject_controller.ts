class SubjectController {
    constructor(subject_selector_tag: string, menu_selector_tag: string) {
        this.subject_selector = document.querySelector(subject_selector_tag) as HTMLElement;
        this.menu_selector = document.querySelector(menu_selector_tag) as HTMLElement;
    }

    public GetSelectedSubject() {
        return this.subject_selector.textContent;
    }
    private subject_selector: HTMLElement;
    private menu_selector: HTMLElement;
}

export {SubjectController}