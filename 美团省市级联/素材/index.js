;(function () {
  const doms = {
    selProvince: document.getElementById('selProvince'),
    selCity: document.getElementById('selCity'),
    selArea: document.getElementById('selArea'),
  }

  /**
   * 远程获取省市区数据，当获取完成后，得到一个数组
   * @returns Promise
   */
  async function getDatas() {
    return fetch('https://study.duyiedu.com/api/citylist')
      .then((resp) => resp.json())
      .then((resp) => resp.data)
  }

  /**
   * 填充下拉框
   * @param {*} select 填充的下拉列表
   * @param {*} list 填充的数据
   */
  function fillSelect(select, list) {
    select.classList.toggle('disabled', !list.length)
    const tipName = select.dataset.name
    const span = select.querySelector('.title span')
    span.innerHTML = `请选择${tipName}`
    select.datas = list
    const ul = select.querySelector('.options')
    ul.innerHTML = list.map((item) => `<li>${item.label}</li>`).join('')
  }

  /**
   * 注册事件处理
   * 1.title点击
   * 2.li点击
   */
  function regCommonEvent(select) {
    // 1.title点击
    const title = select.querySelector('.title')
    title.addEventListener('click', function () {
      if (select.classList.contains('disabled')) return
      const expands = document.querySelectorAll('.select.expand')
      for (const sel of expands) {
        if (sel !== select) {
          sel.classList.remove('expand')
        }
      }
      select.classList.toggle('expand')
    })
    // 2.li点击
    const ul = select.querySelector('.options')
    ul.addEventListener('click', function (e) {
      if (e.target.tagName === 'LI') {
        // 更改li的颜色
        const li = e.target
        const active = ul.querySelector('.active')
        active && active.classList.remove('active')
        li.classList.add('active')
        // 更改title的文本
        const span = select.querySelector('.title span')
        span.innerHTML = li.innerHTML
      }
    })
  }

  /* 省份事件处理 */
  function regProvinceEvent() {
    const ul = doms.selProvince.querySelector('.options')
    ul.addEventListener('click', function (e) {
      if (e.target.tagName === 'LI') {
        const li = e.target
        const province = doms.selProvince.datas.find(
          (item) => item.label === li.innerHTML
        )
        fillSelect(doms.selCity, province.children)
        fillSelect(doms.selArea, [])
      }
    })
  }

  /* 城市事件处理 */
  function regCityEvent() {
    const ul = doms.selCity.querySelector('.options')
    ul.addEventListener('click', function (e) {
      if (e.target.tagName === 'LI') {
        const li = e.target
        const city = doms.selCity.datas.find(
          (item) => item.label === li.innerHTML
        )
        fillSelect(doms.selArea, city.children)
      }
    })
  }

  /* 初始化 */
  async function init() {
    const datas = await getDatas()
    fillSelect(doms.selProvince, datas)
    fillSelect(doms.selCity, [])
    fillSelect(doms.selArea, [])
    regCommonEvent(doms.selProvince)
    regCommonEvent(doms.selCity)
    regCommonEvent(doms.selArea)
    regProvinceEvent()
    regCityEvent()
  }

  init()
})()
