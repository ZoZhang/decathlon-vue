/**
 * Nuit de info pour défi decathlon
 *
 * @author ZHANG Zhao
 * @email  zo.zhang@gmail.com
 * @site   decathlon.zhaozhang.fr
 */

//Sport list in home page
const WEIGHTS_LENGTH = 90;

var sport = new Vue({
    el: '#vue-tag-cloud',
    created() {
        this.fetchData();
    },
    data: {
        sports: [],
        cloud_namespace: Math.floor(Math.random() * 1000000).toString(36),
        options: {
            width: "450",
            height: "450",
            center: {
                x: 200 / 2.0,
                y: 300 / 2.0
            },
            shape: true,
            removeOverflowing: false,
            weights: 3
        },
        already_placed_words: []
    },
    methods: {
        fetchData() {
            this.$http.get('https://sportplaces.api.decathlon.com/api/v1/sports').then(response => {
                this.sports = response.data;
                var tagCloud = document.getElementById("vue-tag-cloud");

                tagCloud.innerText = '';

                this.sports.forEach(
                    function(elem, index) {
                        this.drawOneWord(index, elem);
                    }.bind(this)
                );
                tagCloud.style.left = '-8rem';

            });
        },
        hitTest(elem, other_elems) {
            // Pairwise overlap detection
            var overlapping = function(a, b) {
                if (
                    Math.abs(
                        2.0 * a.offsetLeft +
                        a.offsetWidth -
                        2.0 * b.offsetLeft -
                        b.offsetWidth
                    ) <
                    a.offsetWidth + b.offsetWidth
                ) {
                    if (
                        Math.abs(
                            2.0 * a.offsetTop +
                            a.offsetHeight -
                            2.0 * b.offsetTop -
                            b.offsetHeight
                        ) <
                        a.offsetHeight + b.offsetHeight
                    ) {
                        return true;
                    }
                }
                return false;
            };
            var i = 0;
            // Check elements for overlap one by one, stop and return false as soon as an overlap is found
            for (i = 0; i < other_elems.length; i++) {
                if (overlapping(elem, other_elems[i])) {
                    return true;
                }
            }
            return false;
        },
        getRandomColor(){
            return '#'+Math.floor(Math.random()*16777215).toString(16);
        },
        drawOneWord(index, word) {
            // Define the ID attribute of the span that will wrap the word, and the associated jQuery selector string
            var word_id = this.cloud_namespace + "_word_" + index,
                word_selector = "#" + word_id,
                angle = 6.28 * Math.random(),
                radius = 0.0,
                // Only used if option.shape == 'rectangular'
                steps_in_direction = 0.0,
                quarter_turns = 0.0,
                weight = 5,
                custom_class = "",
                inner_html = "",
                word_span;

            // Check if min(weight) > max(weight) otherwise use default
            if (
                this.sports[0].weight >
                this.sports[this.sports.length - 1].weight
            ) {
                // Linearly map the original weight to a discrete scale from 1 to 10
                weight =
                    Math.round(
                        (word.weight - this.sports[this.sports.length - 1].weight) /
                        (this.sports[0].weight -
                            this.sports[this.sports.length - 1].weight) *
                        (WEIGHTS_LENGTH - 1)
                    ) + 1;
            }

            // Create a new span and insert node.
            word_span = document.createElement("span");
            word_span.className = "w" + weight;
            var textNode = document.createTextNode(word.name);

            word_span.appendChild(textNode);
            word_span.style.color =this.getRandomColor();

            if(typeof word.link !== 'undefined'){
                // Create a link
                var	word_link = document.createElement("a");
                word_link.setAttribute('href', word.link);
                word_link.appendChild(word_span)
                document.getElementById("vue-tag-cloud").appendChild(word_link);
            }else{
                //Normal creation
                document.getElementById("vue-tag-cloud").appendChild(word_span);
            }

            if (this.options.weights) {
                word_span.style.fontSize = this.options.weights[weight - 1];
            }

            var width = word_span.offsetWidth,
                height = word_span.offsetHeight,
                left = this.options.center.x - width / 2.0,
                top = this.options.center.y - height / 2.0;

            var word_style = word_span.style;
            word_style.position = "absolute";
            word_style.left = left + "px";
            word_style.top = top + "px";

            var step = this.options.shape === "rectangular" ? 18.0 : 2.0,
                aspect_ratio = this.options.width / this.options.height;

            //Check if tag are hitting each other
            while (this.hitTest(word_span, this.already_placed_words)) {
                // Default settings: elliptic spiral shape
                radius += step;
                angle += (index % 2 === 0 ? 1 : -1) * step;

                left =
                    this.options.center.x -
                    width / 2.0 +
                    radius * Math.cos(angle) * aspect_ratio;
                top = this.options.center.y + radius * Math.sin(angle) - height / 2.0;

                word_style.left = left + "px";
                word_style.top = top + "px";
            }

            // Don't render word if part of it would be outside the container
            if (
                this.options.removeOverflowing &&
                (left < 0 ||
                    top < 0 ||
                    left + width > options.width ||
                    top + height > options.height)
            ) {
                word_span.remove();
                return;
            }

            this.already_placed_words.push(word_span);
        }
    }
})