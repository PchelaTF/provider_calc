window.addEventListener('DOMContentLoaded', () => {
    // storage selectors
    const storageRangeSelector = document.querySelector('#storage')
    const storageLabelSelector = document.querySelector('#storage-label span')
    // transfer selectors
    const transferRangeSelector = document.querySelector('#transfer')
    const transferLabelSelector = document.querySelector('#transfer-label span')
    // company selectors
    // backblaze
    const backblazePriceBarSelector = document.querySelector('.company-1__pricebar')
    const backblazeTotalPriceSelector = document.querySelector('.company-1__price')
    // bunny
    const bunnyPriceBarSelector = document.querySelector('.company-2__pricebar')
    const bunnyTotalPriceSelector = document.querySelector('.company-2__price')
    const bunnyCheckBoxSelectors = document.querySelectorAll('.company-2__form-group input')
    // scaleway
    const scalewayPriceBarSelector = document.querySelector('.company-3__pricebar')
    const scalewayTotalPriceSelector = document.querySelector('.company-3__price')
    const scalewayCheckBoxSelectors = document.querySelectorAll('.company-3__form-group input')
    // vultr
    const vultrPriceBarSelector = document.querySelector('.company-4__pricebar')
    const vultrTotalPriceSelector = document.querySelector('.company-4__price')
    // 
    const allPriceBar = [backblazePriceBarSelector].concat(bunnyPriceBarSelector, scalewayPriceBarSelector, vultrPriceBarSelector)
    const mql = window.matchMedia('(max-width: 768px)');

    // start input value in label
    storageLabelSelector.innerHTML = storageRangeSelector.value
    transferLabelSelector.innerHTML = transferRangeSelector.value
    changeRange()

    function calc(args) {
        const { storagePrice, transferPrice, storageValue, transferValue, storagePriceDiscount = 0, transferPriceDiscount = 0 } = args

        const currentStoragePrice =
            (storagePrice * storageValue - storagePriceDiscount) > 0 ?
                storagePrice * storageValue - storagePriceDiscount : 0

        const currentTransferPrice =
            (transferPrice * transferValue - transferPriceDiscount) > 0 ?
                transferPrice * transferValue - transferPriceDiscount : 0

        const totalPrice = currentStoragePrice + currentTransferPrice
        const calcWidth = (totalPrice / 100 * 100) * 1

        return { totalPrice, calcWidth }
    }

    function displayTotalPrice(args) {
        const { barSelector, priceSelector, calcWidth, totalPrice, minPrice = 0, maxPrice = 0 } = args

        priceSelector.innerHTML = `${totalPrice.toFixed(2)} $`

        if (mql.matches) {
            barSelector.style.height = calcWidth + '%'

            if (minPrice && totalPrice <= minPrice) {
                priceSelector.innerHTML = `${minPrice} $`
                barSelector.style.height = minPrice + '%'
            }

            if (maxPrice && totalPrice >= maxPrice) {
                priceSelector.innerHTML = `${maxPrice} $`
                barSelector.style.height = maxPrice + '%'
            }

        } else {
            barSelector.style.width = calcWidth + '%'

            if (minPrice && totalPrice <= minPrice) {
                priceSelector.innerHTML = `${minPrice} $`
                barSelector.style.width = minPrice + '%'
            }

            if (maxPrice && totalPrice >= maxPrice) {
                priceSelector.innerHTML = `${maxPrice} $`
                barSelector.style.width = maxPrice + '%'
            }
        }
    }

    function checkedOnClick(selectors) {
        let checkedValue

        selectors.forEach(box => {
            box.addEventListener('click', (e) => {
                const target = e.currentTarget

                for (var i = 0; i < selectors.length; i++) {
                    selectors.item(i).checked = false
                }

                target.checked = true
            })

            return () => box.removeEventListener('click')
        })

        for (let i = 0; i < selectors.length; i++) {
            if (selectors[i].checked) {
                checkedValue = selectors[i].value
            }
        }

        return checkedValue
    }

    function calculationBackblaze(storageValue, transferValue) {
        const minPrice = 7
        const storagePrice = 0.005
        const transferPrice = 0.01
        const calcArgs = {
            storagePrice,
            transferPrice,
            storageValue,
            transferValue,
        }
        const calcObj = calc(calcArgs)
        const displayArgs = {
            barSelector: backblazePriceBarSelector,
            priceSelector: backblazeTotalPriceSelector,
            minPrice: minPrice,
            calcWidth: calcObj.calcWidth,
            totalPrice: calcObj.totalPrice
        }

        displayTotalPrice(displayArgs)
    }

    function calculationBunny(storageValue, transferValue) {
        const maxPrice = 10
        const checkedValue = checkedOnClick(bunnyCheckBoxSelectors)
        const storagePrice = checkedValue === 'SSD' ? 0.02 : 0.01
        const transferPrice = 0.01
        const args = {
            storagePrice,
            transferPrice,
            storageValue,
            transferValue,
        }
        const calcObj = calc(args)
        const displayArgs = {
            barSelector: bunnyPriceBarSelector,
            priceSelector: bunnyTotalPriceSelector,
            maxPrice: maxPrice,
            calcWidth: calcObj.calcWidth,
            totalPrice: calcObj.totalPrice
        }

        displayTotalPrice(displayArgs)
    }

    function calculationScaleway(storageValue, transferValue) {
        const checkedValue = checkedOnClick(scalewayCheckBoxSelectors)
        const storagePrice = checkedValue === 'multi' ? 0.06 : 0.03
        const storagePriceDiscount = (75 * storagePrice)
        const transferPrice = 0.02
        const transferPriceDiscount = (75 * transferPrice)
        const args = {
            storagePrice,
            transferPrice,
            storageValue,
            transferValue,
            storagePriceDiscount,
            transferPriceDiscount
        }
        const calcObj = calc(args)
        const displayArgs = {
            barSelector: scalewayPriceBarSelector,
            priceSelector: scalewayTotalPriceSelector,
            calcWidth: calcObj.calcWidth,
            totalPrice: calcObj.totalPrice
        }

        displayTotalPrice(displayArgs)
    }

    function calculationVultr(storageValue, transferValue) {
        const minPrice = 5
        const storagePrice = 0.01
        const transferPrice = 0.01
        const args = {
            storagePrice,
            transferPrice,
            storageValue,
            transferValue,
        }
        const calcObj = calc(args)
        const displayArgs = {
            barSelector: vultrPriceBarSelector,
            priceSelector: vultrTotalPriceSelector,
            minPrice: minPrice,
            calcWidth: calcObj.calcWidth,
            totalPrice: calcObj.totalPrice
        }

        displayTotalPrice(displayArgs)
    }

    function compare() {
        const priceArr = []

        for (let i = 0; i < allPriceBar.length; i++) {
            if (mql.matches) {
                priceArr.push(parseFloat(allPriceBar[i].style.height))
            } else {
                priceArr.push(parseFloat(allPriceBar[i].style.width))
            }
        }

        const minPrice = Math.min(...priceArr)

        allPriceBar.forEach(el => el.style.removeProperty('background-color'))

        for (let i = 0; i < allPriceBar.length; i++) {
            if (mql.matches) {
                if (parseFloat(allPriceBar[i].style.height) > minPrice) {
                    allPriceBar[i].style.backgroundColor = 'grey'
                }
            } else {
                if (parseFloat(allPriceBar[i].style.width) > minPrice) {
                    allPriceBar[i].style.backgroundColor = 'grey'
                }
            }
        }
    }

    function changeRange() {
        const storageValue = storageRangeSelector.value
        const transferValue = transferRangeSelector.value

        calculationBackblaze(storageValue, transferValue)
        calculationBunny(storageValue, transferValue)
        calculationScaleway(storageValue, transferValue)
        calculationVultr(storageValue, transferValue)
        compare()
    }

    const rangeSelectorsArr = [storage].concat(transfer)
    const checkboxSelectorsArr = [...bunnyCheckBoxSelectors, ...scalewayCheckBoxSelectors]

    rangeSelectorsArr.forEach(element => {
        element.addEventListener('input', () => {
            storageLabelSelector.innerHTML = storageRangeSelector.value
            transferLabelSelector.innerHTML = transferRangeSelector.value

            changeRange()
        });
    })

    checkboxSelectorsArr.forEach(element => {
        element.addEventListener('input', () => {
            changeRange()
        })
    });

    window.addEventListener('resize', () => {
        if (mql.matches) {
            allPriceBar.forEach(el => el.style.removeProperty('width'))
        } else {
            allPriceBar.forEach(el => el.style.removeProperty('height'))
        }

        changeRange()
    })
})
