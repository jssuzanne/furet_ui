# -*- coding: utf-8 -*-
from bottle import route, run, static_file, response, request
from simplejson import dumps, loads
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import (
    create_engine, Column, Integer, String, DateTime, Float, Text, Time,
    Boolean, or_, ForeignKey, Table, LargeBinary, Date
)
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime, time, date


engine = create_engine('postgresql+psycopg2:///furetui', echo=True)
Base = declarative_base(bind=engine)


class Test(Base):
    __tablename__ = 'test'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    creation_date = Column(DateTime)
    creation_date2 = Column(Date)
    state = Column(String)
    number = Column(Float)
    url = Column(String)
    uuid = Column(String)
    password = Column(String)
    color = Column(String)
    text = Column(Text)
    bool = Column(Boolean)
    time = Column(Time)
    json = Column(Text)
    file = Column(LargeBinary)
    filename = Column(String)
    filesize = Column(Integer)

    @classmethod
    def insert(cls, session, data):
        return cls(**data)

    def read(self, fields):
        return [{
            'type': 'UPDATE_DATA',
            'model': 'Test',
            'data': {self.id: {y: getattr(self, y) for y in fields}},
        }]

    def update(self, session, val):
        for k, v in val.items():
            setattr(self, k, v)


association_table = Table(
    'association', Base.metadata,
    Column('customer_id', Integer, ForeignKey('customer.id')),
    Column('category_id', Integer, ForeignKey('category.id'))
)


class Category(Base):
    __tablename__ = 'category'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    customers = relationship(
        "Customer", secondary=association_table, back_populates="categories")

    def read(self, fields):
        res = [{
            'type': 'UPDATE_DATA',
            'model': 'Category',
            'data': {str(self.id): {}},
        }]
        for field in fields:
            if isinstance(field, (list, tuple)):
                field, subfield = field
                for entry in getattr(self, field):
                    res.extend(entry.read([subfield]))

                res[0]['data'][str(self.id)][field] = [str(x.id) for x in getattr(self, field)]

            else:
                res[0]['data'][str(self.id)][field] = getattr(self, field)

        return res

    def update(self, session, val):
        for k, v in val.items():
            if k == 'customers':
                customers = []
                ## for dataId in v:
                ##     if dataId in mapping:
                ##         customers.append(mapping[dataId])
                ##     else:
                ##         customers.append(session.query(Customer).filter(
                ##             Customer.id == int(dataId)).one())

                self.customers = customers
            else:
                setattr(self, k, v)

    @classmethod
    def insert(cls, session, data):
        if 'customers' in data:
            customers = []
            ##for dataId in data['customers']:
            ##    if dataId in mapping:
            ##        customers.append(mapping[dataId])
            ##    else:
            ##        customers.append(session.query(Customer).filter(
            ##            Customer.id == int(dataId)).one())

            data['customers'] = customers

        return cls(**data)


class Customer(Base):
    __tablename__ = 'customer'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    addresses = relationship("Address", back_populates='customer')
    categories = relationship(
        "Category", secondary=association_table, back_populates="customers")

    def read(self, fields):
        res = [{
            'type': 'UPDATE_DATA',
            'model': 'Customer',
            'data': {str(self.id): {}},
        }]
        for field in fields:
            if isinstance(field, (list, tuple)):
                field, subfield = field
                for entry in getattr(self, field):
                    res.extend(entry.read([subfield]))
            if field in ('categories', 'addresses'):
                res[0]['data'][str(self.id)][field] = [str(x.id) for x in getattr(self, field)]
            else:
                res[0]['data'][str(self.id)][field] = getattr(self, field)

        return res

    def update(self, session, val):
        for k, v in val.items():
            if k == 'categories':
                categories = []
                ## for dataId in v:
                ##     if dataId in mapping:
                ##         categories.append(mapping[dataId])
                ##     else:
                ##         categories.append(session.query(Customer).filter(
                ##             Customer.id == int(dataId)).one())

                self.categories = categories
            elif k == 'addresses':
                pass
            else:
                setattr(self, k, v)

    @classmethod
    def insert(cls, session, data):
        ##if 'categories' in data:
        ##    categories = []
        ##    for dataId in data['categories']:
        ##        if dataId in mapping:
        ##            categories.append(mapping[dataId])
        ##        else:
        ##            categories.append(session.query(Category).filter(
        ##                Category.id == int(dataId)).one())

        ##    data['categories'] = categories
        ##if 'addresses' in data:
        ##    del data['addresses']

        return cls(**data)


class Address(Base):
    __tablename__ = 'address'

    id = Column(Integer, primary_key=True)
    street = Column(String)
    zip = Column(String)
    city = Column(String)
    customer_id = Column(Integer, ForeignKey('customer.id'))
    customer = relationship("Customer", back_populates="addresses")

    @hybrid_property
    def complete_name(self):
        return "%s %s %s" % (self.street, self.zip, self.city)

    def read(self, fields):
        res = [{
            'type': 'UPDATE_DATA',
            'model': 'Address',
            'data': {self.id: {}},
        }]
        for field in fields:
            if isinstance(field, (list, tuple)):
                field, subfield = field
                entry = getattr(self, field)
                res.extend(entry.read([subfield]))

            if field == 'customer':
                res[0]['data'][self.id][field] = str(self.customer.id)
            else:
                res[0]['data'][self.id][field] = getattr(self, field)

        return res

    def update(self, session, val):
        for k, v in val.items():
            if k == 'customer':
                pass
                ## if v in mapping:
                ##     self.customer = mapping[v]
                ## else:
                ##     self.customer_id = int(v)
            else:
                setattr(self, k, v)

    @classmethod
    def insert(cls, session, data):
        ##customer = data['customer']
        ##if customer in mapping:
        ##    data['customer'] = mapping[customer]
        ##else:
        ##    data['customer_id'] = int(customer)
        ##    del data['customer']

        return cls(**data)


Base.metadata.create_all()
Session = sessionmaker(bind=engine)
MODELS = {
    'Test': Test,
    'Customer': Customer,
    'Address': Address,
    'Category': Category,
}


def json_serial(obj):
    if isinstance(obj, (datetime, time, date)):
        serial = obj.isoformat()
        return serial

    raise TypeError(repr(obj) + " is not JSON serializable")


def superDumps(data):
    return dumps(data, default=json_serial)


def _getInitRequiredData():
    data = [
        {
            'type': 'UPDATE_RIGHT_MENU',
            'value': {
                'label': 'Login',
                'image': {'type': 'font-icon', 'value': 'fa-user'},
            },
            'values': [
                {
                    'label': 'Login',
                    'image': {'type': 'font-icon', 'value': 'fa-user'},
                    'id': 'login',
                    'values': [
                        {
                            'label': 'Login',
                            'description': 'Log in to use the application',
                            'image': {'type': 'font-icon', 'value': 'fa-user'},
                            'type': 'client',
                            'id': 'Login',
                        },
                    ],
                },
            ],
        },
        {
            'type': 'CLEAR_LEFT_MENU',
        },
    ]
    return superDumps(data)


def _getInitOptionnalData():
    data = [
        {
            'type': 'UPDATE_LOCALES',
            'locales': [
                {
                    'locale': 'fr-FR',
                    'messages': {
                        'menus': {
                            'close': 'Fermer',
                            'search': 'Filtrer par ...',
                        },
                        'views': {
                            'unknown': {
                                'title': 'La vue "{name}" est inconnue',
                                'message': "Veuillez contacter l'administrateur",
                            },
                            'common': {
                                'create': 'Créer',
                                'save': 'Sauvegarder',
                                'edit': 'Modifier',
                                'cancel': 'Annuler',
                                'delete': 'Supprimer',
                                'close': 'Fermer',
                                'actions': 'Actions',
                                'more': 'Autre',
                            },
                            'clients': {
                                'login': {
                                    'button': 'Connexion',
                                },
                            },
                        },
                        'fields': {
                            'common': {
                                'required': 'Ce champs est requis',
                                'no-found': 'Aucune donnée trouvée',
                            },
                            'json': {
                                'invalid': 'Format JSON invalide',
                            },
                            'file': {
                                'upload': u'Sélectioner',
                                'download': u'Télécharger',
                                'delete': u'Supprimer',
                            },
                        },
                    },
                },
            ],
        },
        {
            'type': 'SET_LOCALE',
            'locale': 'fr-FR',
        },
    ]
    return superDumps(data)


def getAction1():
    res = [
        {
            'type': 'UPDATE_ACTION',
            'actionId': '1',
            'label': 'Action : 1',
            'views': [
                {
                    'viewId': '1',
                    'type': 'List',
                },
                {
                    'viewId': '2',
                    'type': 'Thumbnail',
                },
                {
                    'viewId': '3',
                    'type': 'Form',
                },
                {
                    'viewId': '4',
                    'type': 'Calendar',
                },
                {
                    'viewId': '5',
                    'type': 'Kanban',
                },
                {
                    'viewId': '6',
                    'type': 'Graph',
                },
                {
                    'viewId': '7',
                    'type': 'Gantt',
                },
            ],
        }
    ]
    return res, {'viewId': '1'}


def getAction2():
    res = [
        {
            'type': 'UPDATE_ACTION',
            'actionId': '2',
            'label': 'Customer',
            'views': [
                {
                    'viewId': '8',
                    'type': 'List',
                },
                {
                    'viewId': '9',
                    'type': 'Form',
                },
            ],
        }
    ]
    return res, {'viewId': '8'}


def getAction3():
    res = [
        {
            'type': 'UPDATE_ACTION',
            'actionId': '3',
            'label': 'Category',
            'views': [
                {
                    'viewId': '10',
                    'type': 'List',
                },
                {
                    'viewId': '11',
                    'type': 'Form',
                },
            ],
        }
    ]
    return res, {'viewId': '10'}


def getAction4():
    res = [
        {
            'type': 'UPDATE_ACTION',
            'actionId': '4',
            'label': 'Address',
            'views': [
                {
                    'viewId': '12',
                    'type': 'List',
                },
                {
                    'viewId': '13',
                    'type': 'Form',
                },
            ],
        }
    ]
    return res, {'viewId': '12'}


def getAction5():
    res = [
        {
            'type': 'UPDATE_ACTION',
            'actionId': '5',
            'label': 'Customer',
            'views': [
                {
                    'viewId': '9',
                    'type': 'Form',
                },
            ],
        }
    ]
    return res, {'viewId': '9'}


def getAction6():
    res = [
        {
            'type': 'UPDATE_ACTION',
            'actionId': '6',
            'label': 'Category',
            'views': [
                {
                    'viewId': '11',
                    'type': 'Form',
                },
            ],
            'model': 'Category',
        }
    ]
    return res, {'viewId': '11'}


def getAction7():
    res = [
        {
            'type': 'UPDATE_ACTION',
            'actionId': '7',
            'label': 'Address',
            'views': [
                {
                    'viewId': '13',
                    'type': 'Form',
                },
            ],
            'model': 'Address',
        }
    ]
    return res, {'viewId': '13'}


def getAction(actionId):
    if actionId == '1':
        return getAction1()
    elif actionId == '2':
        return getAction2()
    elif actionId == '3':
        return getAction3()
    elif actionId == '4':
        return getAction4()
    elif actionId == '5':
        return getAction5()
    elif actionId == '6':
        return getAction6()
    elif actionId == '7':
        return getAction7()

    raise Exception('Unknown action %r' % actionId)


def getSpace1():
    space = [{
        'type': 'UPDATE_SPACE',
        'spaceId': '1',
        'left_menu': [],
        'right_menu': [],
    }]
    return space, {'actionId': '1', 'viewId': '1'}


def getSpace2():
    space = [{
        'type': 'UPDATE_SPACE',
        'spaceId': '2',
        'left_menu': [
            {
                'label': 'Customer',
                'image': {'type': 'font-icon', 'value': 'fa-user'},
                'actionId': '2',
                'id': '1',
                'submenus': [],
            },
            {
                'label': 'Setting',
                'image': {'type': 'font-icon', 'value': 'fa-user'},
                'actionId': '',
                'id': '2',
                'submenus': [
                    {
                        'label': 'Category',
                        'image': {'type': '', 'value': ''},
                        'actionId': '3',
                        'id': '3',
                        'submenus': [],
                    },
                    {
                        'label': 'Address',
                        'image': {'type': '', 'value': ''},
                        'actionId': '4',
                        'id': '4',
                        'submenus': [],
                    },
                ],
            },
        ],
        'right_menu': [],
    }]
    return space, {'menuId': '1', 'actionId': '2', 'viewId': '8'}


def getSpace(spaceId):
    if spaceId == '1':
        return getSpace1()
    elif spaceId == '2':
        return getSpace2()

    raise Exception('Unknown space %r' % spaceId)


def getView1():
    return {
        'type': 'UPDATE_VIEW',
        'viewId': '1',
        'viewType': 'List',
        'label': 'View : 1',
        'creatable': True,
        'deletable': True,
        'selectable': True,
        'onSelect': '3',
        'model': 'Test',
        'headers': [
            {
                'name': 'id',
                'label': 'ID',
                'numeric': True,
                'component': 'furet-ui-list-field-integer',
            },
            {
                'name': 'name',
                'label': 'Label',
                'sortable': True,
                'component': 'furet-ui-list-field-string',
            },
            {
                'name': 'bool',
                'label': 'Boolean',
                'component': 'furet-ui-list-field-boolean',
            },
            {
                'name': 'state',
                'label': 'State',
                'selections': {'new': 'New', 'started': 'Started', 'done': 'Done'},
                'component': 'furet-ui-list-field-selection',
            },
            {
                'name': 'json',
                'label': 'JSON',
                'component': 'furet-ui-list-field-json',
            },
            {
                'name': 'text',
                'label': 'Text',
                'component': 'furet-ui-list-field-text',
            },
            {
                'name': 'time',
                'label': 'Time',
                'component': 'furet-ui-list-field-time',
            },
            {
                'name': 'password',
                'label': 'Password',
                'component': 'furet-ui-list-field-password',
            },
            {
                'name': 'file',
                'label': 'File',
                'filename': 'filename',
                'filesize': 'filesize',
                'component': 'furet-ui-list-field-file',
                'width': '200px',
            },
        ],
        'search': [
            {
                'key': 'name',
                'label': 'Label',
                "default": 'todo',
            },
            {
                'key': 'creation_date',
                'label': 'Creation date',
            },
        ],
        'buttons': [
            {
                'label': 'Make a call',
                'buttonId': '1',
            },
        ],
        'onSelect_buttons': [
            {
                'label': 'Make a call 2',
                'buttonId': '2',
            },
        ],
        'fields': ["id", "name", "state", "creation_date2", "number", "bool",
                   "color", "text", "time", "file", 'filename', 'filesize',
                   "password", 'url', 'json'],
    }


def getView2():
    return {
        'type': 'UPDATE_VIEW',
        'viewId': '2',
        'viewType': 'Thumbnail',
        'label': 'View : 2',
        'creatable': True,
        'onSelect': '3',
        'model': 'Test',
        'search': [
            {
                'key': 'name',
                'label': 'Label',
                "default": 'todo',
            },
            {
                'key': 'creation_date',
                'label': 'Creation date',
            },
        ],
        'template': '''
            <div class="columns is-multiline is-mobile">
                <div class="column is-4">
                    <furet-ui-thumbnail-field-boolean
                        v-bind:data="card"
                        name="bool"
                        label="Boolean"
                    />
                </div>
                <div class="column is-8">
                    <furet-ui-thumbnail-field-string
                        v-bind:data="card"
                        name="name"
                        label="Label"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-thumbnail-field-selection
                        v-bind:data="card"
                        name="state"
                        label="State"
                        v-bind:selections="{'new': 'New', 'started': 'Started', 'done': 'Done'}"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-thumbnail-field-date
                        v-bind:data="card"
                        name="creation_date2"
                        label="Creation date2"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-thumbnail-field-float
                        v-bind:data="card"
                        name="number"
                        label="Number"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-thumbnail-field-url
                        v-bind:data="card"
                        name="url"
                        label="URL"
                        required="1"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-thumbnail-field-password
                        v-bind:data="card"
                        name="password"
                        label="Password"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-thumbnail-field-color
                        v-bind:data="card"
                        name="color"
                        label="Color"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-thumbnail-field-text
                        v-bind:data="card"
                        name="text"
                        label="Text"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-thumbnail-field-time
                        v-bind:data="card"
                        name="time"
                        label="Time"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-thumbnail-field-file
                        v-bind:data="card"
                        name="file"
                        label="File"
                        filename="filename"
                        filesize="filesize"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-thumbnail-field-json
                        v-bind:data="card"
                        name="json"
                        label="Json"
                    />
                </div>
            </div>
        ''',
        'buttons': [
            {
                'label': 'Make a call',
                'buttonId': '1',
            },
        ],
        'fields': [
            "id", "name", "state", "creation_date2", "number", "url",
            "uuid", "password", "color", "text", "bool", "time", 'json', "file",
            "filename", "filesize",
        ],
    }


def getView3():
    return {
        'type': 'UPDATE_VIEW',
        'viewId': 3,
        'viewType': 'Form',
        'label': 'View : 3',
        'creatable': True,
        'deletable': True,
        'editable': True,
        'onClose': '1',
        'model': 'Test',
        'template': '''
            <div class="columns is-multiline is-mobile">
                <div class="column is-4">
                    <furet-ui-form-field-integer
                        v-bind:config="config"
                        name="id"
                        label="ID"
                        required="1"
                        readonly="1"
                    />
                </div>
                <div class="column is-8">
                    <furet-ui-form-field-string
                        v-bind:config="config"
                        required="fields.number"
                        tooltip="Plop"
                        name="name"
                        label="Label"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-selection
                        v-bind:config="config"
                        name="state"
                        label="State"
                        v-bind:selections="{'new': 'New', 'started': 'Started', 'done': 'Done'}"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-datetime
                        v-bind:config="config"
                        name="creation_date"
                        label="Creation date"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-date
                        v-bind:config="config"
                        name="creation_date2"
                        label="Creation date2"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-float
                        v-bind:config="config"
                        name="number"
                        label="Number"
                        max="2"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-url
                        v-bind:config="config"
                        name="url"
                        label="URL"
                        required="1"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-password
                        v-bind:config="config"
                        name="password"
                        label="Password"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-color
                        v-bind:config="config"
                        name="color"
                        label="Color"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-text
                        v-bind:config="config"
                        name="text"
                        label="Text"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-boolean
                        v-bind:config="config"
                        name="bool"
                        label="Boolean"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-time
                        v-bind:config="config"
                        name="time"
                        label="Time"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-file
                        v-bind:config="config"
                        name="file"
                        label="File"
                        filename="filename"
                        filesize="filesize"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-json
                        v-bind:config="config"
                        name="json"
                        label="JSON"
                    />
                </div>
            </div>
        ''',
        'buttons': [
            {
                'label': 'Make a call',
                'buttonId': '1',
            },
        ],
        'fields': [
            "id", "name", "json", "state", "creation_date2", "number",
            "url", "uuid", "password", "color", "text", "bool", "time",
            'file', 'filename', 'filesize', "creation_date",
        ],
    }


def getView8():
    return {
        'type': 'UPDATE_VIEW',
        'viewId': '8',
        'viewType': 'List',
        'label': 'Customers',
        'creatable': True,
        'deletable': True,
        'selectable': False,
        'onSelect': '9',
        'model': 'Customer',
        'headers': [
            {
                'name': 'name',
                'label': 'Name',
                'component': 'furet-ui-list-field-string',
            },
            {
                'name': 'addresses',
                'label': 'Addresses',
                'model': 'Address',
                'field': 'complete_name',
                'actionId': '7',
                'component': 'furet-ui-list-field-one2many',
            },
            {
                'name': 'categories',
                'label': 'Categories',
                'model': 'Category',
                'field': 'name',
                'actionId': '6',
                'component': 'furet-ui-list-field-many2many',
            },
        ],
        'search': [
        ],
        'buttons': [
        ],
        'onSelect_buttons': [
        ],
        'fields': ["name", ["addresses", "complete_name"], ["categories", "name"]],
    }


def getView9():
    return {
        'type': 'UPDATE_VIEW',
        'viewId': '9',
        'viewType': 'Form',
        'label': 'Customer',
        'creatable': True,
        'deletable': True,
        'editable': True,
        'onClose': '8',
        'model': 'Customer',
        'template': '''
            <div class="columns is-mobile is-multiline">
                <div class="column is-6">
                    <furet-ui-form-field-string
                        v-bind:config="config"
                        required="1"
                        name="name"
                        label="Name"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-string
                        v-bind:config="config"
                        required="1"
                        name="email"
                        label="E-mail"
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-one2many
                        v-bind:config="config"
                        name="addresses"
                        label="Addresses"
                        params='{"model": "Address", "actionId": "4", "many2oneField": "customer"}'
                    />
                </div>
                <div class="column is-6">
                    <furet-ui-form-field-many2many-checkbox
                        v-bind:config="config"
                        name="categories"
                        label="Categories"
                        params='{"model": "Category", "field": "name", "checkbox_class": "is-12-mobile is-6-tablette is-3"}'
                    />
                </div>
            </div>
        ''',
        'buttons': [],
        'fields': ["name", "email", "addresses", ["categories", "name"]],
    }


def getView10():
    return {
        'type': 'UPDATE_VIEW',
        'viewId': '10',
        'viewType': 'List',
        'label': 'Categories',
        'creatable': True,
        'deletable': True,
        'selectable': False,
        'onSelect': '11',
        'model': 'Category',
        'headers': [
            {
                'name': 'name',
                'label': 'Name',
                'component': 'furet-ui-list-field-string',
            },
        ],
        'search': [
        ],
        'buttons': [
        ],
        'onSelect_buttons': [
        ],
        'fields': ["name"],
    }


def getView11():
    return {
        'type': 'UPDATE_VIEW',
        'viewId': '11',
        'viewType': 'Form',
        'label': 'Category',
        'creatable': True,
        'deletable': True,
        'editable': True,
        'onClose': '10',
        'model': 'Category',
        'template': '''
            <div class="columns is-mobile is-multiline">
                <div class="column is-6">
                    <furet-ui-form-field-string
                        v-bind:config="config"
                        required="1"
                        name="name"
                        label="Name"
                    />
                </div>
                <div class="column is-12">
                    <furet-ui-form-field-many2many-tags
                        v-bind:config="config"
                        name="customers"
                        label="Customers"
                        params='{"model": "Customer", "field": "name"}'
                    />
                </div>
            </div>
        ''',
        'buttons': [],
        'fields': ["name", ["customers", "name"]],
    }


def getView12():
    return {
        'type': 'UPDATE_VIEW',
        'viewId': '12',
        'viewType': 'List',
        'label': 'Addresses',
        'creatable': True,
        'deletable': True,
        'selectable': False,
        'onSelect': '13',
        'model': 'Address',
        'headers': [
            {
                'name': 'customer',
                'label': 'Customer',
                'model': 'Customer',
                'field': 'name',
                'actionId': '5',
                'component': 'furet-ui-list-field-many2one',
            },
            {
                'name': 'street',
                'label': 'Street',
                'component': 'furet-ui-list-field-string',
            },
            {
                'name': 'zip',
                'label': 'zip',
                'component': 'furet-ui-list-field-string',
            },
            {
                'name': 'city',
                'label': 'City',
                'component': 'furet-ui-list-field-string',
            },
        ],
        'search': [
        ],
        'buttons': [
        ],
        'onSelect_buttons': [
        ],
        'fields': [["customer", 'name'], "street", "zip", "city"],
    }


def getView13():
    return {
        'type': 'UPDATE_VIEW',
        'viewId': '13',
        'viewType': 'Form',
        'label': 'Category',
        'creatable': True,
        'deletable': True,
        'editable': True,
        'onClose': '12',
        'model': 'Address',
        'template': '''
            <div>
                <div class="columns">
                    <div class="column">
                        <furet-ui-form-field-many2one
                            v-bind:config="config"
                            name="customer"
                            label="Customer"
                            params='{"model": "Customer", "field": "name", "limit": "10", "actionId": "5", "required": "1"}'
                        />
                    </div>
                    <div class="column">
                        <furet-ui-form-field-string
                            v-bind:config="config"
                            required="1"
                            name="street"
                            label="Street"
                        />
                    </div>
                </div>
                <div class="columns">
                    <div class="column">
                        <furet-ui-form-field-string
                            v-bind:config="config"
                            required="1"
                            name="zip"
                            label="Zip"
                        />
                    </div>
                    <div class="column">
                        <furet-ui-form-field-string
                            v-bind:config="config"
                            required="1"
                            name="city"
                            label="City"
                        />
                    </div>
                </div>
            </div>
        ''',
        'buttons': [],
        'fields': ["street", "zip", "city", ["customer", "name"]],
    }


def getView(viewId):
    if viewId == '1':
        view = getView1()
    elif viewId == '2':
        view = getView2()
    elif viewId == '3':
        view = getView3()
    elif viewId == '8':
        view = getView8()
    elif viewId == '9':
        view = getView9()
    elif viewId == '10':
        view = getView10()
    elif viewId == '11':
        view = getView11()
    elif viewId == '12':
        view = getView12()
    elif viewId == '13':
        view = getView13()
    else:
        raise Exception("Unknown view %r" % viewId)

    return view


@route('/furetui/client/login', method='POST')
def getLoginData():
    response.set_header('Content-Type', 'application/json')
    data = [
        {
            'type': 'UPDATE_RIGHT_MENU',
            'value': {
                'label': 'Hello Jean-Sebastien',
                'image': {'type': 'font-icon', 'value': 'fa-user'},
            },
            'values': [
                {
                    'label': 'Login',
                    'image': {'type': 'font-icon', 'value': 'fa-user'},
                    'id': 'login',
                    'values': [
                        {
                            'label': 'Logout',
                            'description': 'Disconnect of the application',
                            'image': {'type': 'font-icon', 'value': 'fa-user'},
                            'type': 'client',
                            'id': 'Logout',
                        },
                    ],
                },
            ],
        },
        {
            'type': 'UPDATE_LEFT_MENU',
            'value': {
                'label': 'Space 1',
                'image': {'type': '', 'value': ''},
            },
            'values': [
                {
                    'label': 'Space groupe 1',
                    'image': {'type': '', 'value': ''},
                    'id': 1,
                    'values': [
                        {
                            'label': 'Space 1',
                            'description': '',
                            'image': {'type': '', 'value': ''},
                            'type': 'space',
                            'id': '1',
                        },
                        {
                            'label': 'Customer',
                            'description': 'Manager customer, address and category',
                            'image': {'type': 'font-icon', 'value': 'fa-user'},
                            'type': 'space',
                            'id': '2',
                        },
                    ],
                },
            ],
        },
        {
            'type': 'UPDATE_ROUTE',
            'path': '/space/1/menu/1/action/1/view/1',
        },
    ]
    return superDumps(data)


def getIdsFromFilter(model, filters):
    ids = []
    try:
        session = Session()
        Model = MODELS[model]
        query = session.query(Model)
        if filters:
            for k, v in filters.items():
                if isinstance(getattr(Model, k).property.columns[0].type, String):
                    query = query.filter(
                        or_(*[getattr(Model, k).ilike('%{}%'.format(x)) for x in v]))
                else:
                    query = query.filter(getattr(Model, k).in_(v))

        ids = [x.id for x in query.all()]
    except AttributeError:
        pass
    finally:
        session.rollback()
        session.close()

    return ids


def _getData(session, model, ids, fields):
    Model = MODELS[model]
    query = session.query(Model)
    query = query.filter(Model.id.in_(ids))
    res = []
    for entry in query.all():
        res.extend(entry.read(fields))

    # merge same model
    return res


def getData(model, ids, fields):
    if not ids:
        return []

    res = []
    try:
        session = Session()
        res.extend(_getData(session, model, ids, fields))
    except:
        session.rollback()
        raise
    finally:
        session.close()

    return res


@route('/furetui/space/<spaceId>', method='POST')
def getSpaceInformation(spaceId=None):
    response.set_header('Content-Type', 'application/json')
    if spaceId is None:
        return superDumps([])

    data = loads(request.body.read())

    res, default = getSpace(spaceId)
    path = ['', 'space', spaceId]
    if data.get('menuId'):
        path.extend(['menu', data['menuId']])
    elif default.get('menuId'):
        path.extend(['menu', default['menuId']])
    if data.get('actionId'):
        path.extend(['action', data['actionId']])
    elif default.get('actionId'):
        path.extend(['action', default['actionId']])
    if data.get('viewId'):
        path.extend(['view', data['viewId']])
    elif default.get('viewId'):
        path.extend(['view', default['viewId']])
    if data.get('dataId'):
        path.extend(['data', data['dataId']])
    if data.get('mode'):
        path.extend(['mode', data['mode']])

    res.append({
        'type': 'UPDATE_ROUTE',
        'path': '/'.join(path),
    })

    return superDumps(res)


@route('/furetui/field/x2x/open', method='POST')
def getM2OAction():
    response.set_header('Content-Type', 'application/json')
    data = loads(request.body.read())
    return superDumps(getAction(data['actionId'])[0])


@route('/furetui/action/<actionId>', method='POST')
def getActionInformation(actionId=None):
    response.set_header('Content-Type', 'application/json')
    if actionId is None:
        return superDumps([])
    data = loads(request.body.read())
    res, default = getAction(actionId)
    path = ['', 'space', data['spaceId']]
    if data.get('menuId'):
        path.extend(['menu', data['menuId']])

    path.extend(['action', actionId])
    if data.get('viewId'):
        path.extend(['view', data['viewId']])
    elif default.get('viewId'):
        path.extend(['view', default['viewId']])
    if data.get('dataId'):
        path.extend(['data', data['dataId']])
    if data.get('mode'):
        path.extend(['mode', data['mode']])

    res.append({
        'type': 'UPDATE_ROUTE',
        'path': '/'.join(path),
    })

    return superDumps(res)


@route('/furetui/view/<viewId>', method='POST')
def getViewInformation(viewId=None):
    response.set_header('Content-Type', 'application/json')
    if viewId is None:
        return superDumps([])

    return superDumps([getView(viewId)])


def getMultiView():
    data = loads(request.body.read())
    print(data)
    ids = getIdsFromFilter(data['model'], data['filter'])
    fields = data.get('fields')
    if fields is None:
        view = getView(data['viewId'])
        fields = view['fields']

    _data = getData(data['model'], ids, fields)
    _data.append({
        'type': 'UPDATE_VIEW',
        'viewId': data['viewId'],
        'dataIds': ids,
    })
    return superDumps(_data)


@route('/furetui/field/x2x/search', method='POST')
def getM2OSearch():
    response.set_header('Content-Type', 'application/json')
    data = loads(request.body.read())
    _data = []
    try:
        session = Session()
        Model = MODELS[data['model']]
        query = session.query(Model)
        if data['value']:
            query = query.filter(getattr(Model, data['field']).ilike('%{}%'.format(data['value'])))

        if data.get('limit'):
            query = query.limit(int(data['limit']))

        ids = [x.id for x in query.all()]
        _data = _getData(session, data['model'], ids, [data['field']])
    except:
        session.rollback()
        raise
    finally:
        session.close()

    return superDumps(_data)


@route('/furetui/list/get', method='POST')
def getListView():
    response.set_header('Content-Type', 'application/json')
    return getMultiView()


@route('/furetui/thumbnail/get', method='POST')
def getThumbnailView():
    response.set_header('Content-Type', 'application/json')
    return getMultiView()


@route('/furetui/form/get', method='POST')
def getFormView():
    response.set_header('Content-Type', 'application/json')
    data = loads(request.body.read())
    fields = data.get('fields')
    if fields is None:
        view = getView(data['viewId'])
        fields = view['fields']

    if data['new'] or data.get('id') is None:
        return superDumps([])

    return superDumps(getData(data['model'], [data['id']], fields))


@route('/furetui/init/required/data', method='POST')
def getInitRequiredData():
    response.set_header('Content-Type', 'application/json')
    return _getInitRequiredData()


@route('/furetui/client/logout', method='POST')
def getLogout():
    response.set_header('Content-Type', 'application/json')
    return _getInitRequiredData()


@route('/furetui/init/optionnal/data', method='POST')
def getInitOptionnalData():
    response.set_header('Content-Type', 'application/json')
    return _getInitOptionnalData()


@route('/furetui/data/create', method='POST')
def createData():
    response.set_header('Content-Type', 'application/json')
    _data = []
    session = Session()
    try:
        data = loads(request.body.read())
        Model = MODELS[data['model']]
        obj = Model.insert(session, data['data'])
        session.add(obj)
        session.commit()
        _data.extend(_getData(session, data['model'], [obj.id], data['fields']))
        path = ['', 'space', data['path']['spaceId']]
        if data['path'].get('menuId'):
            path.extend(['menu', data['path']['menuId']])
        path.extend(['action', data['path']['actionId']])
        path.extend(['view', data['path']['viewId']])
        path.extend(['data', str(obj.id)])
        path.extend(['mode', 'readonly'])
        _data.append({
            'type': 'UPDATE_ROUTE',
            'path': '/'.join(path),
        })
    except Exception as e:
        print(str(e))
        _data = []
        session.rollback()
    finally:
        session.close()

    print (_data)
    return superDumps(_data)


@route('/furetui/data/update', method='POST')
def updateData():
    response.set_header('Content-Type', 'application/json')
    _data = []
    session = Session()
    try:
        data = loads(request.body.read())
        Model = MODELS[data['model']]
        query = session.query(Model).filter(Model.id == int(data['dataId']))
        obj = query.one()
        obj.update(session, data['data'])
        session.commit()
        _data.extend(_getData(session, data['model'], [obj.id], data['fields']))
        path = ['', 'space', data['path']['spaceId']]
        if data['path'].get('menuId'):
            path.extend(['menu', data['path']['menuId']])
        path.extend(['action', data['path']['actionId']])
        path.extend(['view', data['path']['viewId']])
        path.extend(['data', data['dataId']])
        path.extend(['mode', 'readonly'])
        _data.append({
            'type': 'UPDATE_ROUTE',
            'path': '/'.join(path),
        })
    except Exception as e:
        print(str(e))
        _data = []
        session.rollback()
    finally:
        session.close()

    print(_data)
    return superDumps(_data)


@route('/furetui/data/delete', method='POST')
def deleteData():
    response.set_header('Content-Type', 'application/json')
    session = Session()
    _data = []
    try:
        data = loads(request.body.read())
        Model = MODELS[data['model']]
        query = session.query(Model)
        query = query.filter(Model.id.in_([int(x) for x in data['dataIds']]))
        query.delete(synchronize_session='fetch')
        session.commit()
        _data.append({
            'type': 'DELETE_DATA',
            'model': data['model'],
            'dataIds': data['dataIds'],
        })

        if data.get('path'):
            path = ['', 'space', data['path']['spaceId']]
            if data['path'].get('menuId'):
                path.extend(['menu', data['path']['menuId']])
            path.extend(['action', data['path']['actionId']])
            path.extend(['view', data['path']['viewId']])
            _data.append({
                'type': 'UPDATE_ROUTE',
                'path': '/'.join(path),
            })
    except Exception as e:
        print(str(e))
        _data = []
        session.rollback()
    finally:
        session.close()

    return superDumps(_data)


def getFile(filename):
    response = static_file(filename, root='./')
    response.set_header("Cache-Control", "public, max-age=604800")
    return response


@route('/')
def index():
    return getFile('index.html')


@route('/<filepath:path>')
def server_static(filepath):
    return getFile(filepath)


session = Session()
if session.query(Test).count() == 0:
    session.add(
        Test(**dict({
            'name': "todo 1",
            'creation_date': datetime.now(),
            'creation_date2': date.today(),
            'state': 'new',
            'number': 1.2345678,
            'url': 'http://furet-ui.readthedocs.io',
            'uuid': 'uuid---',
            'password': 'password',
            'color': '#3366cc',
            'text': '<div><p><em>Plop</em></p></div>',
            'bool': True,
            'time': time(1, 2, 3),
            'json': '{"a": {"b": [{"c": "d"}, {"e": "f"}]}}'
        }))
    )
    session.add(
        Test(**dict({
            'name': "todo 2",
            'creation_date': datetime.now(),
            'state': 'started',
            'number': 1.2345678,
            'url': 'http://furet-ui.readthedocs.io',
            'uuid': 'uuid---',
            'password': 'password',
            'color': '#36c',
            'text': '<div><p><em>Plop</em></p></div>',
            'bool': True,
            'time': time(1, 2, 3),
            'json': '{"a": {"b": [{"c": "d"}, {"e": "f"}]}}'
        }))
    )
    session.add(
        Test(**dict({
            'name': "todo 3",
            'creation_date': datetime.now(),
            'state': 'done',
            'number': 1.2345678,
            'url': 'http://furet-ui.readthedocs.io',
            'uuid': 'uuid---',
            'password': 'password',
            'color': '#36c',
            'text': '<div><p><em>Plop</em></p></div>',
            'bool': False,
            'time': time(1, 2, 3),
            'json': '{"a": {"b": [{"c": "d"}, {"e": "f"}]}}'
        }))
    )
    session.add(
        Test(**dict({
            'name': "todo 4",
            'creation_date': datetime.now(),
            'state': 'done',
            'number': 1.2345678,
            'url': 'http://furet-ui.readthedocs.io',
            'uuid': 'uuid---',
            'password': 'password',
            'color': '#36c',
            'text': '<div><p><em>Plop</em></p><p>Other line</p></div>',
            'bool': False,
            'time': time(1, 2, 3),
            'json': '{"a": {"b": [{"c": "d"}, {"e": "f"}]}}'
        }))
    )
    session.commit()

if session.query(Category).count() == 0:
    session.add(Category(name="Categ 1"))
    session.add(Category(name="Categ 2"))
    session.add(Category(name="Categ 3"))
    session.add(Category(name="Categ 4"))
    session.add(Category(name="Categ 4"))
    session.add(Category(name="Categ 6"))
    session.add(Category(name="Categ 7"))
    session.commit()

if session.query(Customer).count() == 0:
    customer = Customer(name="JS Suzanne", email="jssuzanne@anybox.fr")
    categories = session.query(Category).all()
    customer.categories = categories
    session.add(customer)
    session.add(Address(street="Anybox", zip="75007", city="Paris", customer=customer))
    session.add(Address(street="Some where", zip="76000", city="Rouen", customer=customer))
    session.commit()

session.close()
run(host='localhost', port=8080, debug=True, reloader=True)
