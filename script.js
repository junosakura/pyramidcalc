class PyramidCalc {

	constructor(row, step) {
		this.initialize(row, step);
		this.createElements();
		this.createGame();
	}

	initialize(row, step) {
		this._row = Math.max(row, 2);
		this._step = Math.max(step, 1);
		this._min = 2 ** (this._row - 1) * this._step;
		this._max = this._min * 5;
		this.$form = document.forms.pyramidcalc;
		this.$form.check.addEventListener("click", this.checkGame.bind(this));
		this.$form.reload.addEventListener("click", this.createGame.bind(this));
	}

	createElements() {
		const $parent = this.$form.querySelector(".pyramid");
		$parent.textContent = null;
		for (let i = 0; i < this._row; i++) {
			this.createNumberElements(i, $parent);
			this.createImageElements(i, $parent);
		}
	}

	createNumberElements(i, $parent) {
		const $numbers = document.createElement("div");
		for (let j = 0; j <= i; j++) {
			const $number = document.createElement("input");
			$number.name = "number";
			$number.type = "number";
			$number.min = 0;
			$number.max = this._max;
			$number.step = this._step;
			$numbers.appendChild($number);
		}
		$parent.appendChild($numbers);
	}

	createImageElements(i, $parent) {
		if (i == this._row - 1) return;
		const $images = document.createElement("div");
		for (let j = 0; j <= i * 2 + 1; j++) {
			const $image = document.createElement("img");
			$image.src = "arrow.svg";
			$image.width = 32;
			$image.height = 32;
			$image.alt = "";
			$images.appendChild($image);
		}
		$parent.appendChild($images);
	}

	createGame() {
		const values = this.createValues();
		const flags = this.createFlags();
		this.$form.number.forEach((e, i) => {
			e.value = flags[i] ? values[i] : "";
			e.disabled = flags[i] ? true : false;
		});
	}

	createValues() {
		const values = [];
		for (let i = 0; i < this._row; i++) {
			const array = [];
			for (let j = 0; j <= i; j++) {
				if (i == 0) {
					const min = Math.floor(this._min / this._step);
					const max = Math.floor(this._max / this._step);
					const num = Math.floor(Math.random() * (max - min) + min) * this._step;
					array.push(num);
				}
				else if (j == 0) {
					const min = 2 ** (this._row - i - 1);
					const max = Math.floor((values[i-1][0] - min) / this._step);
					const num = Math.floor(Math.random() * (max - min) + min) * this._step;
					array.push(num);
				}
				else {
					const min = array[j-1];
					const max = values[i-1][j-1];
					const num = max - min;
					if (num < 0) return this.createValues();
					array.push(num);
				}
			}
			values.push(array);
		}
		return values.flat(1);
	}

	createFlags() {
		const flags = [];
		for (let i = 0; i < this._row; i++) {
			const array = [];
			for (let j = 0; j <= i; j++) {
				const sum = array.filter((e) => e).length;
				const rnd = Math.round(Math.random());
				if (i == 0) {
					array.push(1);
				}
				else if (j == i && !sum && !rnd) {
					array.push(1);
				}
				else if (j == i && sum == i) {
					array.push(0);
				}
				else {
					array.push(rnd);
				}
			}
			flags.push(array);
		}
		return flags.flat(1);
	}

	checkGame() {
		const result = this.getResult();
		if (result == -1) return alert("未入力の枠があります");
		if (result == 0) return alert("不正解！");
		if (result == 1) return confirm("正解！リロードしますか？") ? this.createGame() : false;
	}

	getResult() {
		const $number = Array.from(this.$form.number);
		const every = $number.every((e) => e.value);
		if (!every) return -1;
		for (let i = 0, count = 0; i < this._row - 1; i++) {
			for (let j = 0; j <= i; j++, count++) {
				const n = Number($number[count].value);
				const a = Number($number[count+i+1].value);
				const b = Number($number[count+i+2].value);
				if (a + b != n) return 0;
			}
		}
		return 1;
	}

}
