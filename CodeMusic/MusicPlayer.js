/*
1. Render songs
2. Scroll top
3. Play / pause / seek
4. CD rotate
5. Next / prev
6. Random
7. Next / repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = " Đặng Ngọc Sơn"

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const cd = $('.cd')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Ấn nút nhớ thả giấc mơ",
            singer: "Sơn Tùng MTP",
            image: "../ImgMusic/Img1.jpg",
            path: "../ListMusic/Song1.mp3"
        },
        {
            name: "Buông đôi tay nhau ra",
            singer: "Sơn Tùng MTP",
            image: "../ImgMusic/Img2.jpg",
            path: "../ListMusic/Song2.mp3"
        },
        {
            name: "Chạy ngay đi",
            singer: "Sơn Tùng MTP",
            image: "../ImgMusic/Img3.jpg",
            path: "../ListMusic/Song3.mp3"
        },
        {
            name: "Chúng ta của hiện tại",
            singer: "Sơn Tùng MTP",
            image: "../ImgMusic/Img4.jpg",
            path: "../ListMusic/Song4.mp3"
        },
        {
            name: "Mashup Nevada - Đi Đi ĐI",
            singer: "K-ICM, T-ICM, Kelcy, Zickky",
            image: "../ImgMusic/Img5.jpg",
            path: "../ListMusic/Song5.mp3"
        },
        {
            name: "Một năm mới bình an",
            singer: "Sơn Tùng MTP",
            image: "../ImgMusic/Img6.jpg",
            path: "../ListMusic/Song6.mp3"
        },
        {
            name: "Thái bình mồ hôi rơi",
            singer: "Sơn Tùng MTP",
            image: "../ImgMusic/Img7.jpg",
            path: "../ListMusic/Song7.mp3"
        },
        {
            name: "Thà Đừng nói ra",
            singer: "Bảo Kun",
            image: "../ImgMusic/Img8.jpg",
            path: "../ListMusic/Song8.mp3"
        },
        {
            name: "Cứ nói yêu lần này",
            singer: "LIL Z POET",
            image: "../ImgMusic/Img9.jpg",
            path: "../ListMusic/Song9.mp3"
        },
        {
            name: "Thích Thích",
            singer: "Phương Ly",
            image: "../ImgMusic/Img10.jpg",
            path: "../ListMusic/Song10.mp3"
        }
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index = "${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const _this = this
        // xử lý phóng to / thu nhỏ CD
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

        }

        // khi song được play 
        audio.onplay = function () {
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // khi song bị pause
        audio.onpause = function () {
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // xử lý khi tua Song
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next bài hát 
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.crollToActiveSong()
        }

        // Khi prev bài hát 
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        // Xử lý bật / tắt Random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // xử lý lặp lại một bài hát
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            // xử lý khi click vào song
            if (songNode || e.target.closest('.option')) {

                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý khi click vào song option
                if (e.target.closest('.option')) {

                }
            }
        }



    },

    crollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },

    loadCurentSong: function () {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurentSong()
    },

    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        // Render playlist
        this.render()
        // Lắng nghe, xử lý các sự kiện (DOM events)
        this.handleEvents()
        // Định nghĩa các thuộc tính cho Obj
        this.defineProperties()
        // Tải thông tin bài hát đầu tiên vào UI Khi chạy ứng dụng
        this.loadCurentSong()

        // Hiển thị trạng thái ban đầu của button repeat và random
        repeatBtn.classList.toggle('active', _this.isRepeat)
        randomBtn.classList.toggle('active', _this.isRandom)
    }
}

app.start();