PGDMP  5                
    |            tasker    16.2    17.0 :    2           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            3           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            4           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            5           1262    16917    tasker    DATABASE     y   CREATE DATABASE tasker WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Polish_Poland.1250';
    DROP DATABASE tasker;
                     mytravel_test    false            �            1259    17000    logs    TABLE     �   CREATE TABLE public.logs (
    id integer NOT NULL,
    user_id integer,
    event_type character varying(50) NOT NULL,
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.logs;
       public         heap r       mytravel_test    false            �            1259    16999    logs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.logs_id_seq;
       public               mytravel_test    false    227            6           0    0    logs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;
          public               mytravel_test    false    226            �            1259    16961 	   reminders    TABLE     �   CREATE TABLE public.reminders (
    id integer NOT NULL,
    task_id integer NOT NULL,
    reminder_time timestamp without time zone NOT NULL,
    is_sent boolean DEFAULT false
);
    DROP TABLE public.reminders;
       public         heap r       mytravel_test    false            �            1259    16960    reminders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reminders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.reminders_id_seq;
       public               mytravel_test    false    222            7           0    0    reminders_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.reminders_id_seq OWNED BY public.reminders.id;
          public               mytravel_test    false    221            �            1259    16974    tags    TABLE     _   CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);
    DROP TABLE public.tags;
       public         heap r       mytravel_test    false            �            1259    16973    tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.tags_id_seq;
       public               mytravel_test    false    224            8           0    0    tags_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;
          public               mytravel_test    false    223            �            1259    16931 
   task_lists    TABLE     �   CREATE TABLE public.task_lists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.task_lists;
       public         heap r       mytravel_test    false            �            1259    16930    task_lists_id_seq    SEQUENCE     �   CREATE SEQUENCE public.task_lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.task_lists_id_seq;
       public               mytravel_test    false    218            9           0    0    task_lists_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.task_lists_id_seq OWNED BY public.task_lists.id;
          public               mytravel_test    false    217            �            1259    17010    task_lists_id_seq1    SEQUENCE     �   ALTER TABLE public.task_lists ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.task_lists_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               mytravel_test    false    218            �            1259    16982 	   task_tags    TABLE     ]   CREATE TABLE public.task_tags (
    task_id integer NOT NULL,
    tag_id integer NOT NULL
);
    DROP TABLE public.task_tags;
       public         heap r       mytravel_test    false            �            1259    16944    tasks    TABLE     k  CREATE TABLE public.tasks (
    id integer NOT NULL,
    list_id integer,
    title character varying(255) NOT NULL,
    description text,
    due_date timestamp without time zone,
    is_completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.tasks;
       public         heap r       mytravel_test    false            �            1259    16943    tasks_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.tasks_id_seq;
       public               mytravel_test    false    220            :           0    0    tasks_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;
          public               mytravel_test    false    219            �            1259    16919    users    TABLE       CREATE TABLE public.users (
    id integer NOT NULL,
    auth0_id character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    username character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    picture character varying
);
    DROP TABLE public.users;
       public         heap r       mytravel_test    false            �            1259    16918    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               mytravel_test    false    216            ;           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               mytravel_test    false    215            x           2604    17003    logs id    DEFAULT     b   ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);
 6   ALTER TABLE public.logs ALTER COLUMN id DROP DEFAULT;
       public               mytravel_test    false    226    227    227            u           2604    16964    reminders id    DEFAULT     l   ALTER TABLE ONLY public.reminders ALTER COLUMN id SET DEFAULT nextval('public.reminders_id_seq'::regclass);
 ;   ALTER TABLE public.reminders ALTER COLUMN id DROP DEFAULT;
       public               mytravel_test    false    221    222    222            w           2604    16977    tags id    DEFAULT     b   ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);
 6   ALTER TABLE public.tags ALTER COLUMN id DROP DEFAULT;
       public               mytravel_test    false    224    223    224            q           2604    16947    tasks id    DEFAULT     d   ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);
 7   ALTER TABLE public.tasks ALTER COLUMN id DROP DEFAULT;
       public               mytravel_test    false    219    220    220            n           2604    16922    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               mytravel_test    false    215    216    216            .          0    17000    logs 
   TABLE DATA           L   COPY public.logs (id, user_id, event_type, message, created_at) FROM stdin;
    public               mytravel_test    false    227   B       )          0    16961 	   reminders 
   TABLE DATA           H   COPY public.reminders (id, task_id, reminder_time, is_sent) FROM stdin;
    public               mytravel_test    false    222   6B       +          0    16974    tags 
   TABLE DATA           (   COPY public.tags (id, name) FROM stdin;
    public               mytravel_test    false    224   �B       %          0    16931 
   task_lists 
   TABLE DATA           C   COPY public.task_lists (id, user_id, name, created_at) FROM stdin;
    public               mytravel_test    false    218   �B       ,          0    16982 	   task_tags 
   TABLE DATA           4   COPY public.task_tags (task_id, tag_id) FROM stdin;
    public               mytravel_test    false    225   �C       '          0    16944    tasks 
   TABLE DATA           p   COPY public.tasks (id, list_id, title, description, due_date, is_completed, created_at, updated_at) FROM stdin;
    public               mytravel_test    false    220   �C       #          0    16919    users 
   TABLE DATA           S   COPY public.users (id, auth0_id, email, username, created_at, picture) FROM stdin;
    public               mytravel_test    false    216   E       <           0    0    logs_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.logs_id_seq', 1, false);
          public               mytravel_test    false    226            =           0    0    reminders_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.reminders_id_seq', 17, true);
          public               mytravel_test    false    221            >           0    0    tags_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.tags_id_seq', 1, false);
          public               mytravel_test    false    223            ?           0    0    task_lists_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.task_lists_id_seq', 1, false);
          public               mytravel_test    false    217            @           0    0    task_lists_id_seq1    SEQUENCE SET     B   SELECT pg_catalog.setval('public.task_lists_id_seq1', 176, true);
          public               mytravel_test    false    228            A           0    0    tasks_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.tasks_id_seq', 40, true);
          public               mytravel_test    false    219            B           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 2, true);
          public               mytravel_test    false    215            �           2606    17008    logs logs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.logs DROP CONSTRAINT logs_pkey;
       public                 mytravel_test    false    227            �           2606    16967    reminders reminders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.reminders DROP CONSTRAINT reminders_pkey;
       public                 mytravel_test    false    222            �           2606    16981    tags tags_name_key 
   CONSTRAINT     M   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);
 <   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_name_key;
       public                 mytravel_test    false    224            �           2606    16979    tags tags_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_pkey;
       public                 mytravel_test    false    224            �           2606    16937    task_lists task_lists_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.task_lists
    ADD CONSTRAINT task_lists_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.task_lists DROP CONSTRAINT task_lists_pkey;
       public                 mytravel_test    false    218            �           2606    16986    task_tags task_tags_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_pkey PRIMARY KEY (task_id, tag_id);
 B   ALTER TABLE ONLY public.task_tags DROP CONSTRAINT task_tags_pkey;
       public                 mytravel_test    false    225    225            �           2606    16954    tasks tasks_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_pkey;
       public                 mytravel_test    false    220            {           2606    16927    users users_auth0_id_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_auth0_id_key UNIQUE (auth0_id);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_auth0_id_key;
       public                 mytravel_test    false    216            }           2606    16929    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 mytravel_test    false    216                       2606    16925    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 mytravel_test    false    216            �           2606    16968     reminders reminders_task_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.reminders DROP CONSTRAINT reminders_task_id_fkey;
       public               mytravel_test    false    220    4739    222            �           2606    16938 "   task_lists task_lists_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.task_lists
    ADD CONSTRAINT task_lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.task_lists DROP CONSTRAINT task_lists_user_id_fkey;
       public               mytravel_test    false    218    216    4735            �           2606    16992    task_tags task_tags_tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.task_tags DROP CONSTRAINT task_tags_tag_id_fkey;
       public               mytravel_test    false    225    4745    224            �           2606    16987     task_tags task_tags_task_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.task_tags DROP CONSTRAINT task_tags_task_id_fkey;
       public               mytravel_test    false    4739    225    220            �           2606    16955    tasks tasks_list_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.task_lists(id) ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_list_id_fkey;
       public               mytravel_test    false    218    4737    220            .      x������ � �      )   Z   x�u��	�0г=EH��|���s��	�6=t�C �ʈ�D��֋��	JW��U(SE�:��C&Af����c����8��L�|n��      +      x������ � �      %   �   x���9nC1E��sڀ>��u�t��E� .l���P8�W��\��lؾ����~j?��۩a; d�M�9�����/\~y5��5]F�p�q�T�R̮��=���V��r^���]�ܒ������y������O�2�2�N���	��	������^�)��^#�;l;= �q_      ,      x������ � �      '   j  x��R�j�0<[_��؇V�u쩐kO���Ŵ$%q)���	�����	y�P0^�Yfvg�m�Q���[��,6��������{��_[�S���i�B� �5�{g)��=�@"�+���Ps��O�W����ι�Ǝ��`��[�ɒB�!8
�W(Ci���y��o��(c�L.��>2<2>� ���Pƃ��~<v�F���_,� ��-�y�hG5P1HJ��thS�q���z�N<�D��h�̠,}:��z�L�y ��C��s)E�芸�m�z��b8���2������Hj+�!)�R�N^O�Uyi@���y_���|X����η1�P��pv�T�gqḼT(���1����n      #   �   x�U���0D��?`YJ�@1!�ƥ_����S��7~�+�Y�I&'����}�"9�L���+�%:p\$u�n�/��E�����x:?�A}:�gw�cG[�+z�T���$e4" �iÙ2�MV 4gW�`���6���
�k�o[���~�'���tH�%5%�|��C�     