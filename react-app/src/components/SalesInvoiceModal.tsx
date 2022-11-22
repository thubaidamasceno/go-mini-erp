import {
    EuiBasicTable,
    EuiBasicTableColumn,
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiSpacer,
} from '@elastic/eui';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSalesInvoiceSpecific } from '../api/SalesInvoice';
import { salesInvoiceSpecific } from '../type/SalesInvoice';
import FlyoutDescriptionList from './FlyoutDescriptionList';
import SalesInvoiceDownload from './SalesInvoiceDownload';

const columns: EuiBasicTableColumn<any>[] = [
    {
        field: 'name',
        name: 'Variant Name',
    },
    {
        field: 'batch_id',
        name: 'Batch ID',
        width: '10%',
    },
    {
        field: 'description',
        name: 'Description',
    },
    {
        field: 'price',
        name: 'Price',
    },
    {
        field: 'discount',
        name: 'Discount (%)',
    },
    {
        field: 'quantity',
        name: 'Quantity',
    },
    {
        field: 'total',
        name: 'Total',
        width: '16%',
    },
];

const SalesInvoiceModal = ({
    id,
    toggleModal,
}: {
    id: number;
    toggleModal: (value: React.SetStateAction<boolean>) => void;
}) => {
    let location = useLocation();
    let navigate = useNavigate();
    const [data, setData] = useState<salesInvoiceSpecific>();
    const [items, setItems] = useState<Array<{ [key: string]: ReactNode }>>([]); // accountable for items in table
    const [pdfModal, setPdfModal] = useState<boolean>(false);

    useEffect(() => {
        console.log('here');
        fetchSalesInvoiceSpecific({
            id: id,
            navigate: navigate,
            location: location,
        }).then((data) => {
            if (data) {
                setData(data);
                setItems(
                    data.items.map((item) => {
                        return {
                            name: item.name,
                            batch_id: item.batch_id,
                            description: item.description,
                            price: 'Rp. ' + item.price.toLocaleString('id-ID'),
                            discount: item.discount + '%',
                            quantity: item.quantity.toLocaleString('id-ID'),
                            total: 'Rp. ' + item.total.toLocaleString('id-ID'),
                        };
                    })
                );
            }
        });
    }, [id, navigate, location]);

    return (
        <EuiModal onClose={() => toggleModal(false)}>
            <EuiModalHeader>
                <EuiModalHeaderTitle>
                    <h1>Sales Invoice {id}'s details</h1>
                </EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody>
                <EuiFlexGroup direction='row'>
                    <EuiFlexItem>
                        <FlyoutDescriptionList
                            title='ID'
                            description={data?.id}
                        />
                        <FlyoutDescriptionList
                            title='Custome Name'
                            description={data?.customer_name}
                        />
                        <FlyoutDescriptionList
                            title='Term Of Payment'
                            description={data?.top_name}
                        />
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <FlyoutDescriptionList
                            title='Date'
                            description={new Date(
                                data?.date || ''
                            ).toLocaleDateString('id-ID')}
                        />
                        <FlyoutDescriptionList
                            title='Created By'
                            description={data?.created_by}
                        />
                        <FlyoutDescriptionList
                            title='Total'
                            description={
                                'Rp. ' + data?.total?.toLocaleString('id-ID')
                            }
                        />
                    </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer size='xl' />
                <EuiBasicTable items={items} columns={columns} />
            </EuiModalBody>
            <EuiModalFooter>
                <EuiButton
                    iconType='download'
                    color='text'
                    onClick={() => setPdfModal(!pdfModal)}
                >
                    Download PDF
                </EuiButton>
                <EuiButton onClick={() => toggleModal(false)}>Close</EuiButton>
            </EuiModalFooter>
            {pdfModal && (
                <SalesInvoiceDownload data={data} toggleModal={setPdfModal} />
            )}
        </EuiModal>
    );
};

export default SalesInvoiceModal;
