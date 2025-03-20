import { showConfirmDialog, showDialog } from 'vant'

function confirm({title='',message='',cancelButtonText='取消',confirmButtonText='确定'}){
	return new Promise((resolve,reject)=>{
		showConfirmDialog({
			title: title,
			message: message,
			cancelButtonText: cancelButtonText,
			confirmButtonText: confirmButtonText
		}).then(() => {
			resolve()
		}).catch(() => {
			reject()
		});
	})
}

function alert({title='',message='',cancelButtonText='取消',confirmButtonText='确定'}){
	return new Promise((resolve,reject)=>{
		showDialog({
			title: title,
			message: message,
			cancelButtonText: cancelButtonText,
			confirmButtonText: confirmButtonText
		}).then(() => {
			resolve()
		}).catch(() => {
			reject()
		});
	})
}

export default {
	confirm,
	alert
}