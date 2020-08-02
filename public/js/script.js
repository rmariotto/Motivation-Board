(function () {

    Vue.component('first-component', {
        template: '#template',
        props: ['id'],
        data: function () {
            return {
                url: '',
                username: '',
                title: '',
                description: '',
                created_at: '',
                comment: '',
                comments: []
            };
        },

        mounted: function () {

            var self = this;

            axios.get(`/images/${this.id}`)
                .then((result) => {
                    self.url = result.data.url;
                    self.username = result.data.username;
                    self.title = result.data.title;
                    self.description = result.data.description;
                    self.created_at = result.data.created_at;
                })
                .catch((err) => {
                    console.log('err in get /image on component: ', err);

                });

            axios.get(`/comments/${this.id}`)
                .then((result) => {
                    self.comments = result.data;
                })
                .catch((err) => {
                    console.log('err in get /comment on component:', err);

                });

        },
        methods: {
            closeModal: function () {
                this.$root.$emit("close-modal");
            },

            submitComment: function (e) {
                e.preventDefault;
                var self = this;

                axios.post('/comments', {
                    imageId: this.id,
                    username: this.username,
                    comment: this.comment
                })
                    .then(function (result) {
                        self.comments.unshift(result.data);

                    })
                    .catch(function (err) {
                        console.log('err in POST /comment: ', err);

                    });
            }
        }
    });

    new Vue({
        el: '#main',
        data: {
            images: [],
            username: '',
            title: '',
            description: '',
            file: null,
            id: null
        },

        mounted: function () {
            var self = this;

            axios.get('/images')
                .then((result) => {
                    self.images = result.data;
                });
            this.$on("close-modal", () => {
                self.id = false;
            });
        },

        methods: {
            handleClick: function (e) {
                e.preventDefault();

                var formData = new FormData();
                formData.append('username', this.username);
                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('file', this.file);

                var self = this;

                axios.post('/upload', formData)
                    .then(function (result) {
                        console.log('result from POST /upload: ', result);
                        self.images.unshift(result.data);
                        self.username = '';
                        self.title = '';
                        self.description = '';
                    })
                    .catch(function (err) {
                        console.log('err in POST /upload: ', err);
                    });

            },
            handleChange: function (e) {
                console.log('handleChange is running!!!');
                console.log('file: ', e.target.files[0]);

                this.file = e.target.files[0];
                console.log('this after adding file: ', this);
            },
            modal: function (id) {
                this.id = id;
            },
        }

    });


})();