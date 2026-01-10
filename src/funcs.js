//
// Bold position slider
//
const bold_pos_slider = document.querySelector("#bold-pos-slider");
const bold_pos_text = document.querySelector("#bold-pos-text");

bold_pos_slider.addEventListener("input", (e) => {
    const position = e.target.value;
    bold_pos_text.innerText = position;
    updateTextGradient();
});

function getWeightFunctionPosition() {
    return parseFloat(bold_pos_slider.value);
}


//
// Bold width slider
//
const bold_width_slider = document.querySelector("#bold-width-slider");
const bold_width_text = document.querySelector("#bold-width-text");

bold_width_slider.addEventListener("input", (e) => {
    const width = e.target.value;
    bold_width_text.innerText = width;
    updateTextGradient();
    update_position_slider_limits(width);
});

function update_position_slider_limits(width) {
    // For our function:
    //    -(1/w)(x - offset) + 1
    // The roots are:
    //      +/- sqrt(w)
    // So we set the position slider min/max to
    //      min: 0-sqrt(w)
    //      max: n_letters + sqrt(w)
    // This ensure that we can slide our function completely outside the text.
    const sqrtw = Math.ceil(Math.sqrt(width));
    bold_pos_slider.min = 0 - sqrtw;
    bold_pos_slider.max = n_letters + sqrtw;
    // Trigger label update.
    bold_pos_slider.dispatchEvent(new Event('input'));
}

function getWeightfunctionWidth() {
    return parseFloat(bold_width_slider.value);
}


//
// Bold min slider
//
const min_weight_slider = document.querySelector("#min-weight-slider");
const min_weight_text = document.querySelector("#min-weight-text");

min_weight_slider.addEventListener("input", (e) => {
    const weight = e.target.value;
    min_weight_text.innerText = weight;
    updateTextGradient();
});

function getMinWeight() {
    return parseInt(min_weight_slider.value);
}


//
// Bold max slider
//

const max_weight_slider = document.querySelector("#max-weight-slider");
const max_weight_text = document.querySelector("#max-weight-text");

max_weight_slider.addEventListener("input", (e) => {
    const weight = e.target.value;
    max_weight_text.innerText = weight;
    updateTextGradient();
});

function getMaxWeight() {
    return parseInt(max_weight_slider.value);
}



function setSliderAndLabelValue(input_slider, slider_label) {

    position = input_slider.value;

    // Set the label to match the slider
    slider_label.innerText = position;
    input_slider.dispatchEvent(new Event('input'));

}



function getNormalizedWeight(func_pos_normalized, letter_pos_normalized, width) {
    // Input:
    //
    // func_pos_normalized: float [0, 1] 
    //      Where the peak of this function should be
    //
    // letter_pos_normalized: float[0, 1]
    //      Where in the string we should compute the weight
    //
    // width: float[1, ?]
    //      The width of the bold function
    //
    // Returns:
    //      weight: float[0, 1]
    //

    var weight = -(1 / width) * Math.pow((letter_pos_normalized - func_pos_normalized), 2) + 1;

    weight = Math.max(weight, 0);
    return weight;
}

// function getNormalizedWeightSine(func_pos_normalized, letter_pos_normalized, width = 2) {
//     position = 2 * Math.PI * func_pos_normalized;
//     let x = letter_pos_normalized;
//     return (Math.sin(x * width + position) / 2) + 0.5;
// }

function mapNormalizedWeight(normalized_weight, min_weight, max_weight) {
    // A simple linear map that maps the normalized weight to the range
    // 
    // I.e. normalized_weight = 0 => min_weight
    //      normalized_weight = 1 => max_weight
    // 


    const mapped_weight = (max_weight - min_weight) * normalized_weight + min_weight;
    return mapped_weight;
}



let n_letters = null;
function generateTextElement() {
    const textcontainer = document.querySelector('.textcontainer');
    const text = "THIS IS A LONGER LINE OF TEXT";
    // const text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been" +
    //     "the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and " +
    //     "scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into " +
    //     "electronic typesetting, remaining essentially unchanged. ";
    n_letters = text.length;
    const letters = text.split('');
    letters.map((letter) => {
        const element = document.createElement("span");
        const text = document.createTextNode(letter);
        element.appendChild(text);
        textcontainer.appendChild(element);
    });

    // Set the position slider to [0, letter.length]
    bold_pos_slider.min = 0;
    bold_pos_slider.max = letters.length;
    bold_pos_slider.value = Math.round(letters.length / 2);
    // Trigger update of slider label.
    bold_pos_slider.dispatchEvent(new Event('input'));
}

generateTextElement();



function updateTextGradient() {
    const letter_elements = document.querySelectorAll(".textcontainer>span")
    if (letter_elements) {
        const length = letter_elements.length;
        const bold_position = getWeightFunctionPosition();
        const bold_width = getWeightfunctionWidth();
        const min_weight = getMinWeight()
        const max_weight = getMaxWeight();

        letter_elements.forEach((element, index) => {
            const normalized_weight = getNormalizedWeight(bold_position, index, bold_width);
            const mapped_weight = mapNormalizedWeight(normalized_weight, min_weight, max_weight);
            element.style.setProperty("font-weight", mapped_weight);

        });

    }
}

updateTextGradient();


function animate() {
    var current_slider_value = parseInt(bold_pos_slider.value);
    current_slider_value += 1;
    if (current_slider_value > bold_pos_slider.max) {
        const overshoot = current_slider_value - parseInt(bold_pos_slider.max);
        current_slider_value = parseInt(bold_pos_slider.min) + overshoot;
    }
    current_slider_value = current_slider_value;

    bold_pos_slider.value = current_slider_value;
    bold_pos_slider.dispatchEvent(new Event('input'));
}

const toggle_animate = document.querySelector(".switch>input");
var interval_timer = null;
toggle_animate.addEventListener('change', () => {
    if (toggle_animate.checked) {
        interval_timer = setInterval(animate, 40);
    } else {
        clearInterval(interval_timer);
    }
});


setSliderAndLabelValue(bold_pos_slider, bold_pos_text);
setSliderAndLabelValue(bold_width_slider, bold_width_text);
setSliderAndLabelValue(min_weight_slider, min_weight_text);
setSliderAndLabelValue(max_weight_slider, max_weight_text);
