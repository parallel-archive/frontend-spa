import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import { WidgetWithStore } from './WidgetWithStore';
import "./GlobalMenu";

@customElement('frequently-asked-questions')
export class FAQ extends WidgetWithStore {
    static styles = css`
        :host {
            display: block;
        }
        main {
            margin: 0 auto;
            max-width: 90%;
            padding: 2rem 0;
            position: relative;
        }
        @media(min-width: 1024px) {
            :host main {
                max-width: 960px;
            }
        }
        @media(min-width: 1024px) {
            :host main {
                padding-left: calc(var(--desktop-menu-slim-width) + 130px);
                max-width: calc(800px + var(--desktop-menu-stacked-width));
                padding-right: 20px;
            }
        }
    `;

    render() {
        return html`
            <global-menu user=${(this.store?.user?.name || "")}></global-menu>
            <main>
                <h1>Frequently Asked Questions</h1>
                <h4>How can I benefit from registering with PA?</h4>
                <p>As a registered PA user you can use your PA Shoebox to store your scanned files online. You will be able to make your documents public or keep them private for up to two years. By assembling your files, you can create documents and we will guarantee that the original files constituting the document remain unaltered. Their integrity will not change over time.</p>
                <p>You can arrange and work with your collected documents and take advantage of our social software features like tagging and forums. System-generated text versions of your scans are exclusively available for you, as the owner of the digital copy. You can also download searchable PDF versions of your documents or share citations with your scholarly colleagues. The PA system offers a fixed URL for all your public documents, which you can reference in your scholarly work.</p>

                <h4>What can I do as a guest?</h4>
                <p>You can browse, search, and read all the public documents in the PA repository and read scholarly comments, but to gain access to personalized services and other features described above, you need to register with PA.</p>

                <h4>Why should I choose a nickname instead of a real name when registering with PA?</h4>
                <p>We highly encourage you to use a nickname rather than your real name as your username. It will help you and us to protect your privacy. However, you may decide to disclose your profile information to the public. In this case the Privacy Policy will only partly apply and we cannot fully prevent future privacy violations by a third party.</p>

                <h4>What does Open ID mean? How can I use it?</h4>
                <p>OpenID eliminates the need for multiple usernames across different websites, thus simplifying your online experience. You can choose the OpenID provider that best meets your needs and, most importantly, that you trust. At the same time, your OpenID can stay with you, no matter which provider you move to. And best of all, the OpenID technology is not proprietary and is completely free. You can use your OpenID on any one of a growing number of sites (nearly ten-thousand) which support OpenID. Here are sites you can visit to see where you can currently use your OpenID:</p>
                <p>myOpenID Site Directory <a href="https://www.myopenid.com/directory">https://www.myopenid.com/directory</a></p>
                <p>The OpenID Directory <a href="http://openiddirectory.com/">http://openiddirectory.com/</a></p>

                <p>If you don’t have an OpenID yet. Here is a <a href="http://wiki.openid.net/w/404/OpenIDServers">list of OpenID providers</a>. In PA you can attach your OpenID during the registration process or you can attach and manage your OpenID through your Profile.</p>

                <h4>How do I Upload to PA? Which upload method should I choose?</h4>
                <p>There are three upload methods in PA: (1.) Simple Upload requires you to browse and select files from your computer one by one. If you have slow internet connection, we recommend this method. (2.) The Standard Upload makes the process much faster as you can use the Ctrl and Shift keys to select multiple files at the same time. (3.) Drag and Drop requires a Java Plug-in, which will automatically download to your browser when you link to the page. Drag and Drop allows you to click on one more more files on your desktop and drag straight to the PA upload box, where you can initiate the upload process.</p>

                <h4>What are the preferred file formats to upload?</h4>
                <p>In the Beta version we only support TIFF, JPEG and PDF image file formats. The recommended resolution is between 200 and 400 DPI, grayscale or black/white. TIFF is desirable to obtain a high quality text from your scan converted using the Optical Character Recognition (OCR) software, Abbyy Fine Reader 2.0. Large, colored files are also accepted but they occupy greater space in your account, which is calculated based on your Shoebox files and your private documents and is limited to 50MB. The more documents you share with the PA Community, the more space you can save for yourself in the PA system.</p>

                <h4>How many files can I upload and store in PA?</h4>
                <p>The number of files is not limited, although each user has his or her temporary storage limit of 50MB. This space is recovered each time the Shoebox is emptied or private documents are made public. The current status of your account is indicated on a bar below the Shoebox; the percentage includes all your Shoebox files and private documents. For the sake of the better performance, we also limit a single upload to 10MB.</p>

                <h4>How can I use the Shoebox?</h4>
                <p>Your Shoebox is temporary online storage where you can keep all the scans of archival primary sources that you plan to use in the PA system. All your uploaded files end up here, and you can leave them here indefinitely until you reach the storage limitation. You can sort or rotate your files before moving to the document Assemble page, or you can simply delete files from your Shoebox. To avoid unnecessary duplication, we do not allow multiple copies of the same file to be uploaded into your Shoebox.</p>

                <h4>How do I assemble and describe a document?</h4>
                <p>The primary scope of PA is to have users assemble meaningful documents - including photos, maps, drawings as well - along with good descriptive data. On the Assemble page you can view the content of the Shoebox with the number of files indicated. By dragging files into the area on the right, you prepare files for Document Description. Follow the link Document Description - in the upper and bottom right corner - to the form where the descriptive information about the document can be entered. Required fields are highlighted, additional fields are only shown as links. Make sure that document Type field is properly filled in, in case of mixed content, e.g. newspaper clippings containing both text and image, you need to check both types.</p>
                <p>Instructions about data entry are available in the green icons above fields. Move your mouse over to activate them. Please pay attention to two specific fields: Document Source includes the name of the custodian, which can be an institution or private individual having ownership over the original documents. We do not accept URL information as source, personal or institutional websites should be indicated in the Source URL field.</p>
                <p>You also need to come to a conscious decision on making a document Public or Private: PA encourages you to publicize as many documents as you can, although copyright and privacy issues need to be taken into consideration by the document owner. Descriptive data about documents can be modified by the owner of the document, their status - public or private - does not matter. The, PA system keeps track of all the changes and the relevant page for this action is Edit Description.</p>

                <h4>Why should I make documents public?</h4>
                <p>PA is designed to facilitate scholarly collaboration and encourage users to share primary sources with each other. However, we do understand that individual interests can overwrite altruism, and we do offer the possibility to keep documents private for two years. After two years the PA system automatically changes the status from private to public and informs the document owner about the action. During the private life-cycle of the document deletion can occur at any time, it is an act performed exclusively by the document owner; editable text versions, page notes, downloadable PDF copies are also available on private documents. We cannot guarantee on private materials: fixed URL is assigned for citation purposes, reference should be made on PA Forums, and there is no secure algorithm to ensure the integrity of the files for long term preservation. Private documents cannot be tagged, commented and collected by others, therefore their metadata cannot be enriched and they cannot be part of larger thematic schemes created by tags.</p>

                <h4>How do I delete documents in PA?</h4>
                <p>PA Community members can delete any of their private documents from their collections or files from their Shoebox. Virtual collections can also include shortcuts to documents owned by somebody else, in this case these public documents will remain in PA Repository, and only the shortcut gets deleted from the virtual collection. Public documents cannot be automatically deleted, in case of complaint, any user can request the deletion by sending an email to the PA Administrator. The place of the deleted public documents gets frozen along with its fixed URL, visitors of the page will be informed of the reasons for removing the document.</p>

                <h4>What is the difference between All My Documents and Virtual Collections?</h4>
                <p>All My Documents folder serves as your personal archive, it includes permanent copies of all your uploaded documents, within this folder you can arrange the items by date of upload, title, and their current status (private or public) in PA. Being the solely owner of these items, you can delete private ones, but not the public ones, in either case you have the right to update their descriptions and converted text versions. Meanwhile virtual Collections keep copies of your uploaded documents and collected ones from the PA repository. You can create a collection by simply choosing the Collect link and dragging documents into folders down to a three level hierarchy. Under the Manage link you can arrange, rename your folders of your Virtual Collections, though only empty folders can be deleted from the structure. If you decide to delete a folder content -both shortcuts or your own documents - alert messages will warn you about the potential consequences of your act.</p>

                <h4>How can I cite a document from the PA repository?</h4>
                <p>PA facilitates scholarly citations by offering a fixed URL to public documents, the link include explicit reference to the PA repository and the identification number of the document. PA guarantees the long-term maintenance of the link which can be referred in scholarly works and publications. In Document View you can email the standard citation of the document along with the URL to yourself or somebody else.</p>

                <h4>How can I do a simple search?</h4>
                <p>The simple search box is available throughout the whole PA site, it is the quickest way to find items in your Virtual Collections, All My Documents and the PA public Repository. By typing in the term(s) into the box, PA search engine combs through all of the public documents, their text versions and descriptive data including your private documents as well. The simple search function can be used in a more sophisticated way if you place the search terms in quotes: “Hungarian Revolution”. (Space between two terms means AND relation) In case of a long hit list you can furthermore refine your search results if you select the three categories: Type, Language, Country.<br>On the discussion of the Forums you can also run a simple search to find relevant comments and postings, here you can choose between technical or content related topics.</p>

                <h4>When do I need to use advanced search?</h4>
                <p>In many cases, PA simple search or sorting options are not efficient enough to quickly find the documents or any information in the public PA repository or in your private collections. Advanced search is a powerful tool to retrieve specific items from a huge information hub, it allows you to make specific queries on both private and public facets of PA , and in general it helps you to shape your research process.</p>
                <p>From the first drop down menu, on the right, you can set the field you want to search through. In the text field on the left you can enter the term you want to search for. Multiple terms are searched as Boolean AND, quotes are also helpful for phrases. You can then add additional criteria to your search if you click the More sign on the right side of the drop down menu, it will add another row to your search. You can add no more than ten criteria, ten rows, at the same time you can also limit the search to type, period covered, language and country. (The country list is based on modern boundaries and it gets automatically updated by the growing number of countries covered in PA.)</p>

                <h4>Why are tags useful? What can I do with my own tags?</h4>
                <p>On the contrary to hierarchical systems, tagging is an easy way to categorize documents by attaching descriptive keywords to them. These keywords can be extremely useful if the same word does not appear elsewhere on the document or in the document. E.g. A full text version of the document dealing with the Prague events in 1989 may not include the expression “Velvet Revolution”, but as a tag added to the document can help other researchers to get oriented. You can tag your or others documents with whatever relevant keyword or term you would like associated with that given item. Your tags - can be found under MyTags- allow you to sift through your own collected or uploaded documents in a personal way, by the categories that you deem relevant. These thematic schemes drawn by you with the help of tags can complement the more formal structure in Virtual Collections.</p>
                <p>The general tag cloud can be viewed under Tags, but the tag cloud only represent the top 150 tags on documents by various users in the PA Repository. The tag size reflects the number of documents given the tag.</p>
                <p>Assigning a tag is a function to be found on the Document View, every PA member can add a tag -new or existing one - to any item. Most popular tags given by multiple members on the same documents are usually listed as Top Tags on hit lists, My Collection and Repository page.<br>On the My Tags page you can globally manage your own tags by replacing or deleting old ones, which means renaming across items or deleting it from all the records it is attached to.</p>

                <h4>How can I comment on a document and how does it relate to Forums?</h4>
                <p>The first comment posted on a document - in Document View - will immediately generate a forum discussion under the About Documents category. You as the initiator of the document related discussion become the moderator of the discussion, and the same role empowers you with special responsibilities. You need to make sure that the tone of the discussion is appropriate for a scholarly and educational site, embedded links or attached references are need to be checked and removed by you in case of necessity. As a moderator you can completely delete a post, but no editing option is available.</p>

                <h4>Why is OCR useful? How can I edit the text version of my document?</h4>
                <p> <a href="https://en.wikipedia.org/wiki/Optical_character_recognition">OCR (Optical Character Recognition)</a> program is a way of converting image files (from the scanner or digital camera) into a text form suitable for editing and full text search. Our OCR Program, ABBYY Fine Reader 2.0, in theory, can read 200 languages, it automatically prepares image files for text conversion, it corrects contrast, image quality, orientation, and positioning. However, in the PA Beta version we have limited the number of languages recognized by the program: all major European, Eastern and Central European languages are still supported. Meanwhile other languages will become part of the PA OCR process if a critical mass of archival documents in that particular language is uploaded by the users.</p>
                <p>Text versions of digital image files can only be edited by the owner of the document on the Edit Text Version page. In course of updating the text version of the document it may happen some accidental change in the text, with the help of reOCR button you will be able to recover the system-generated version of the text. Any improvement done on the text version increases radically the searchability of the document across PA system. In addition, text versions become part of the PDF files that can be downloaded by any registered user.</p>

                <h4>Why does OCR not always work?</h4>
                <p>Files containing both image and text are equally processed by the OCR program, image documents, including photos, maps, drawings etc., are automatically excluded. If you have mistakenly categorized your text document as an image, please change it on the Edit Description page.</p>
                <p>Generally, OCR works best on TIFF files scanned at 200-300 dpi, greyscale or black and white images. Other formats and quality files are converted with varied results. Good quality scans as the result of documents pressed properly onto the flat bad scanners or fed into the automatic feeder can substantially improve the correctness of the text version.</p>

                <p><i>Last edited October 2008.</i></p>
                <global-footer></global-footer>
            </main>
        `;
    }
}