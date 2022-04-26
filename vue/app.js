Vue.config.devtools = true;
var app = new Vue({
    el: '#app',
    data: {
        state: null,
    },
    watch: {
        "state.effect": function (effect, old) {
            if (old == undefined) return
            axios.post('/state', { effect })
                .then(response => {
                    this.state = response.data
                })
        }
    },
    methods: {
        lightEndingSteps() {
            axios.post('/lightEndingSteps')
        },
        changeState(type) {
            axios.post('/state', { [type]: !this.state[type] })
                .then(response => {
                    this.state = response.data
                })
        },
        changedColor(event) {
            if (this.state.animationRunning) return
            axios.post('/setColor', { color: event.target.value })
        },
        sendGet(param) {
            axios.get(param)
                .then((response) => {
                    this.state = response.data
                })
        }
    },
    created: function () {
        axios.get('/state')
            .then(response => {
                this.state = response.data
            })
    }
})