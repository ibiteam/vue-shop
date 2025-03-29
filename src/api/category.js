import $http from '@/utils/http'

export function cateAxios(param){
  return $http.doGet('v1/category', param)
}

export function navAxios(){
  return new Promise(resolve => {
    resolve({
      "message": "success",
      "code": 200,
      "data": {
        "component_name": "home_nav",
        "sort": 23,
        "base_data": {
          "logo": "https:\/\/cdn.toodudu.com\/2024\/02\/21\/SxByupLBFwXlsTicpmLwvAEH1Kn1CflX2wjRhiDE.jpg",
          "top_bg_image": "https:\/\/cdn.toodudu.com\/2024\/01\/25\/xhopa8lLTZ8rITP1LxnFT32fFCcB6lfaMw6ANss1.jpg",
          "home_bg_image": "https:\/\/cdn.toodudu.com\/2024\/01\/25\/UnbNFjY4E3ss4senvcDvu4p8uE1X6l5fM488MulY.jpg",
          "items": [
            {
              "icon": "https:\/\/cdn.toodudu.com\/uploads\/2023\/10\/27\/sign_in.png",
              "text": "\u7b7e\u5230",
              "font_color": "#FFFFFF",
              "is_show_number": 0,
              "not_read_number": "",
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/signIn\/index"
            }
          ]
        },
        "search_data": {
          "button_color": "#FF5227",
          "search_font_color": "#EDF3F9",
          "items": [
            {
              "keywords": "\u82f9\u679c",
              "sort": "1",
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/good?goods_id=7266",
              "url_alias": "goods"
            },
            {
              "keywords": "\u7279\u5356\u6a58\u5b50",
              "sort": "1",
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/good?goods_id=7331",
              "url_alias": "goods"
            }
            ,
            {
              "keywords": "123213123123",
              "sort": "1",
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/good?goods_id=7331",
              "url_alias": "goods"
            }
            ,
            {
              "keywords": "24352323423423423423",
              "sort": "1",
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/good?goods_id=7331",
              "url_alias": "goods"
            }
          ]
        },
        "nav_data": {
          "font_default_color": "#FFFFFF",
          "font_selection_color": "#FFFFFF",
          "items": [
            {
              "index": 1,
              "title": "\u63a8\u8350",
              "fixed_position": "left",
              "sort": 11,
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/",
              "icon": null
            },
            {
              "index": 47,
              "title": "\u4e59\u70ef\u4ea7\u4e1a\u94fe",
              "fixed_position": null,
              "sort": 1,
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/industry?industry_id=47",
              "icon": null
            },
            {
              "index": 19,
              "title": "\u73bb\u7483\u4ea7\u4e1a\u94fe",
              "fixed_position": null,
              "sort": 1,
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/industry?industry_id=19",
              "icon": null
            },
            {
              "index": 13,
              "title": "\u949b\u767d\u7c89\u4ea7\u4e1a",
              "fixed_position": null,
              "sort": 1,
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/industry?industry_id=13",
              "icon": null
            },
            {
              "index": 18,
              "title": "\u4e59\u9187\u4ea7\u4e1a\u94fe",
              "fixed_position": null,
              "sort": 1,
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/industry?industry_id=18",
              "icon": null
            },
            {
              "index": 17,
              "title": "\u7532\u9187\u4ea7\u4e1a\u94fe",
              "fixed_position": null,
              "sort": 1,
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/industry?industry_id=17",
              "icon": null
            },
            {
              "index": 3,
              "title": "\u5206\u7c7b",
              "fixed_position": "right",
              "sort": 1,
              "url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/category?type=search",
              "icon": "https:\/\/cdn.toodudu.com\/2024\/05\/17\/PW95lR19Vq6qeyfqAG3JfayyIrRN2Pj4oEjzFJt7.jpg"
            }
          ]
        },
        "is_show_nav_data": true
      }
    })
  })
}
