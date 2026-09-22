'use strict';
'require view';

// 首页「快速设置」入口卡片
// 加载机制：view/status/index.js 会 fs.list 本目录，对所有 .js 文件按名字典序
// require('view.status.include.' + 文件名)，并在每个轮询周期调用 load().catch(...)。
// 注意两点：
//   1. 必须自定义 load() 且返回 Promise —— 基类默认 load() 返回 undefined，
//      invokeIncludesLoad 里 `includes[i].load().catch(...)` 会抛
//      "Cannot read properties of undefined (reading 'catch')"。
//   2. 文件名必须是合法 JS 标识符片段（不能带数字前缀以外的符号）。

return view.extend({
	title: '',

	load: function () {
		return Promise.resolve();
	},

	render: function () {
		var card = E('div', { 'class': 'cbi-section', 'id': 'q30-wizard-entry' }, [
			E('h3', {}, [ _('快速设置向导') ]),
			E('div', { 'class': 'cbi-section-descr' }, [
				_('初次使用，或需要修改上网方式、Wi-Fi 名称与密码时，可通过向导一键完成配置。')
			]),
			E('div', { 'style': 'margin-top:12px' }, [
				E('a', {
					'class': 'btn cbi-button cbi-button-apply',
					'href': '/cgi-bin/wizard?op=page',
					'target': '_blank',
					'style': 'text-decoration:none'
				}, [ _('打开快速设置向导') ])
			])
		]);

		fetch('/cgi-bin/wizard?op=state', { cache: 'no-store' })
			.then(function (r) { return r.json(); })
			.then(function (s) {
				if (s && !s.done && s.firstboot)
					card.insertBefore(
						E('div', { 'class': 'alert-message warning' }, [
							_('路由器尚未完成首次设置，建议立即运行快速设置向导。')
						]),
						card.firstChild
					);
			})
			.catch(function () {});

		return card;
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
