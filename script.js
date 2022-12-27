// Uncomment to highlight unused variables and parameters
// require('');

const INPUT_HOLDER_CLASS = 'input-holder';
const SHOP_INPUT_CLASS = 'shop-input';
const COUNT_RESULT_TEXT = 'count-result-text';

const mainForm = document.querySelector('.shop-form');
const mainFormAddBtn = document.querySelector('.shop-add-btn');
const mainFormResetBtn = document.querySelector('.shop-reset-btn');

const { inputsConfig, resultText, resultWarningText, resultErrorText } =
  window.config;

let step = 0;

// Helper to set multiple attributes to any HTML element
function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

// Create inputs for one element
const createInputsRow = () => {
  const id = `material-${step}`;

  const inputWrapper = document.createElement('div');
  const selectElement = document.createElement('select');
  const inputElement = document.createElement('input');
  const removeButton = document.createElement('button');
  const removeImage = document.createElement('img');

  setAttributes(inputWrapper, { class: INPUT_HOLDER_CLASS });
  setAttributes(selectElement, { name: id });
  setAttributes(inputElement, {
    id,
    placeholder: 'Enter number',
    class: SHOP_INPUT_CLASS,
  });
  setAttributes(removeButton, { class: 'input-remove-btn', type: 'button' });
  setAttributes(removeImage, {
    class: 'input-remove-btn-img',
    src: 'assets/images/remove-icon.png',
  });

  inputsConfig.forEach((stepConfigForNames, index) => {
    const selectName = stepConfigForNames.name;
    const selectOption = document.createElement('option');
    const selectOptionText = document.createTextNode(selectName);
    selectOption.append(selectOptionText);

    // Set first element as selected
    setAttributes(selectOption, {
      ...{ value: index },
      ...(!index && { selected: true }),
    });
    selectElement.append(selectOption);
  });

  removeButton.append(removeImage);
  inputWrapper.append(selectElement, inputElement, removeButton);
  removeButton.addEventListener('click', () => inputWrapper.remove());

  return inputWrapper;
};

const resetForm = () => {
  document.querySelector(`.${COUNT_RESULT_TEXT}`)?.remove();

  const inputHolders = document.querySelectorAll(`.${INPUT_HOLDER_CLASS}`);
  [].forEach.call(inputHolders, (holder) => {
    holder.querySelector('input').value = '';
    holder.querySelector('select').value = 0;
    holder.remove();
  });

  step = 0;
};

// Add new input to the form
const addInput = () => {
  mainForm.append(createInputsRow());
  step++;
};

// Form result handler
const countInputsSum = () => {
  const currentInputFields = document.querySelectorAll(
    `.${INPUT_HOLDER_CLASS}`
  );
  return [].reduce.call(
    currentInputFields,
    (accum, HTMLInput) => {
      const inputValue = HTMLInput.querySelector('input').value;
      const selectValue = HTMLInput.querySelector('select').value;

      const { weight, price } = inputsConfig[selectValue];
      const resultStuffPrice = (price / weight) * Number(inputValue);
      return accum + resultStuffPrice;
    },
    0
  );
};

const getResultText = () => {
  const stuffInputs = document.querySelectorAll('.shop-input');
  const isEmptyInput = [].some.call(stuffInputs, (input) => !input.value);

  return isEmptyInput ? resultWarningText : resultText;
};

const addResultMessage = () => {
  document.querySelector(`.${COUNT_RESULT_TEXT}`)?.remove();

  const calculatedResult = countInputsSum();

  const resultMessage = document.createElement('p');
  const messageTextNode = isNaN(calculatedResult)
    ? resultErrorText
    : document.createTextNode(
        `${getResultText()}: ${calculatedResult.toFixed(2)}`
      );
  resultMessage.setAttribute('class', COUNT_RESULT_TEXT);
  resultMessage.append(messageTextNode);
  mainForm.after(resultMessage);
};

const onFormSubmit = (event) => {
  event.preventDefault();
  addResultMessage();
};

mainFormAddBtn.addEventListener('click', addInput);
mainFormResetBtn.addEventListener('click', resetForm);

mainForm.addEventListener('submit', onFormSubmit);
