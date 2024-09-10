import { ref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

type Types = {
    label: string,
    value: string,
    key: string
}


export const typeOptions: Types[] = [
    {
        label: '日常走访',
        value: 'zf',
        key: 'zf',
    },
    {
        label: '诉求处理',
        value: 'sq',
        key: 'sq',
    },
]
export const apiType = ref(typeOptions[0].value)

export const columns: BasicColumn[] = [
    {
        title: '企业服务管家姓名',
        dataIndex: 'realName',
        width: 120,
    },
    {
        title: '服务类型',
        dataIndex: 'type',
        format(text, record, index) {
            const current = typeOptions.find((v: any) => v.value == text)
            return current?.label || text
        },
        width: 120,
    },
    {
        title: '服务企业名称',
        dataIndex: 'entName',
        width: 120,
    },
    {
        title: '服务内容',
        dataIndex: 'content',
        width: 120,
    },
    {
        title: '服务时间',
        dataIndex: 'createTime',
        width: 150,
    },
];



export const searchFormSchema: FormSchema[] = [
    // {
    //     label: '企业名称',
    //     field: 'entName',
    //     component: 'Input',
    // },
    {
        label: '企业管家',
        field: 'realName',
        component: 'Input',
    },
    {
        label: '服务类型',
        field: 'type',
        component: 'Select',
        defaultValue: typeOptions[0].value,
        componentProps: {
            placeholder: '请选择服务类型',
            options: typeOptions,
            allowClear: false,
            onChange(val) {
                apiType.value = val;
            }
        },
        colProps: { span: 8 },
    },
    // {
    //     label: '上传时间',
    //     field: 'Date',
    //     component: 'RangeDate',
    //     colProps: { span: 8 },
    //     componentProps: {
    //         style: { width: '100%' }
    //     }
    // },

];

