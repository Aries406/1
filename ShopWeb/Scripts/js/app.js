let block1 = new Vue({
    el: '#tab',
    data: {
        tab1: [],
        tab2: [],
        tab3: []
    },
    mounted: function() {
        const vm = this;
        axios.get('js/products.json')
            .then(response => {
                vm.tab1 = response.data.Tab[0].Tab1
                vm.tab2 = response.data.Tab[0].Tab2
                vm.tab3 = response.data.Tab[0].Tab3
                console.log(vm.tab1);
            })
            .catch(function(error) {
                console.log(error);
            });
    }
})

let block2 = new Vue({
    el: '#app',
    data: {
        data: [],
        search: '',
        currentPage: 0, //頁數
        locations: [], //地區
        currrentCountry: '', //國家
        currrentZone: '' //區域
    },

    methods: {
        getUniqueList() {
            const country = new Set();
            const zone = new Set();
            const vm = this;
            vm.data.forEach((item, i) => {
                country.add(item.country)
                zone.add(item.zone)
            })
            console.log(country)
            console.log(zone)
            vm.country = Array.from(country);
            vm.zone = Array.from(zone);
        }
    },
    computed: {

        filterData() {
            const vm = this
                //先過濾
            let items = []
                //判斷國家
            if (vm.currrentCountry !== '' && vm.currrentZone == '') {
                items = vm.data.filter((item, i) => {
                    console.log(item)
                    return item.country == vm.currrentCountry
                })
            } else if (vm.currrentZone !== '') {
                items = vm.data.filter((item, i) => {
                    console.log(item)
                    return item.zone == vm.currrentZone
                })
            } else if (vm.search) {
                items = vm.name.toLowerCase().includes(vm.search.toLowerCase())

            } else {
                items = vm.data
            }


            // 有幾頁
            // 每頁的資料內容
            const newData = []

            items.forEach((item, i) => {
                if (i % 9 === 0) {
                    newData.push([])
                }
                const page = parseInt(i / 9)
                newData[page].push(item)
            })
            console.log(newData)
            return newData
        },

    },
    mounted() {
        const vm = this;
        axios.get('js/products.json')
            .then(response => {
                vm.data = response.data.Items
                console.log(vm.data);
                vm.getUniqueList()
            })
            .catch(function(error) {
                console.log(error);
            });
    }
})