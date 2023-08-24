function subformSubmit() {
    $("#sub-form").submit();
}
const chBoxes = document.querySelectorAll(
    '.dropdown-menu input[type="checkbox"]'
);
const dpBtn = document.getElementById("multiSelectDropdown");
let mySelectedListItems = [];

function handleCB() {
    mySelectedListItems = [];
    let mySelectedListItemsText = "";

    chBoxes.forEach((checkbox) => {
        if (checkbox.checked) {
            mySelectedListItems.push(checkbox.value);
            mySelectedListItemsText =
                mySelectedListItems.length + " Selected";
        }
    });

    dpBtn.innerText =
        mySelectedListItems.length > 0
            ? mySelectedListItemsText
            : "Select Department";
}

chBoxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCB);
});